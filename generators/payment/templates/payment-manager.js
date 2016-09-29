var Promise = require('bluebird')
var crypto = require('crypto')
var fs = require('fs')
var moment = require('moment')
var UserManager = require('../user/user-manager')
var config = require('../../system/config-manager').getConfig()
var pingpp = require('pingpp')(config.pingpp.apiKey)

pingpp.setPrivateKeyPath(config.pingpp.privateKeyPath)

var getRandomIntInclusive = require('../../system/util').getRandomIntInclusive
var SettingManager = require('../setting/setting-manager')

var paymentHistoryModel = require('./paymentHistory-model')

var readFile = Promise.promisify(fs.readFile)

module.exports.pay = pay
module.exports.saveChargeEvent = saveChargeEvent
module.exports.isChargePaid = isChargePaid
module.exports.verifySignature = verifySignature

function generateOrderNo(channel) {
  if (channel === 'cmb_wallet') {
    // 6 位 或 10 位纯数字字符串
    return getRandomIntInclusive(1000000000, 9999999999)
  } else {
    // alipay: 1-64 位， wx: 2-32 位，bfb: 1-20 位，upacp: 8-40 位，yeepay_wap:1-50 位
    // jdpay_wap:1-30 位，cnp_u:8-20 位，cnp_f:8-20 位
    var currentTime = moment().format('YYYYMMDDHHmmssSSS')

    return currentTime + String(getRandomIntInclusive(100, 999))
  }
}

function buildExtra(channel) {
  var extra = {}

  switch (channel) {
    case 'wx_pub_qr':
      extra.product_id = '1'
      break
    case 'alipay_wap':
      extra.success_url = config.host + '/payment/paymentSuccess'
      extra.cancel_url = config.host + '/payment/paymentCancel'
      break
    case 'alipay_pc_direct': //支付宝即时到账
      extra.success_url = config.host + '/payment/paymentSuccess'
      break
    // case 'upacp_wap':
    // case 'upacp_pc': //银联网关支付
    //   extra.result_url = 'http://127.0.0.1/paymentSuccess'
    //   break
    // case 'wx_pub':
    //   extra.open_id = 'User Open Id'
    //   break
    // case 'bfb_wap':
    //   extra.result_url = 'http://127.0.0.1/bfbPaymentResult'
    //   extra.bfb_login = false
    //   break
    // case 'yeepay_wap':
    //   extra.product_category = '1'
    //   extra.identity_id = 'Your identity_id'
    //   extra.identity_type = 1
    //   extra.terminal_type = 1
    //   extra.terminal_id = 'Your terminal_id'
    //   extra.user_ua = 'Your user_ua'
    //   extra.result_url = 'http://127.0.0.1/yeepayPaymentResult'
    //   break
    // case 'jdpay_wap':
    //   extra.success_url = 'http://127.0.0.1/jdSuccess'
    //   extra.fail_url = 'http://127.0.0.1/jdFail'
    //   extra.token = 'Your Token'
    //   break
    // case 'cnp_u':
    //   extra.source = 'Your TokenId'
    //   extra.sms_code = {
    //     id: 'Your SmsId',
    //     code: 'Your SmsCode'
    //   }
    //   break
    // case 'cnp_f':
    //   extra.source = 'Your TokenId'
    //   break
    // case 'fqlpay_wap':
    //   extra.c_merch_id = '21321'
    //   extra.return_url = 'http://127.0.0.1/fqlPayReturn'
    //   break
    // case 'qgbc_wap':
    //   extra.phone = '13523456789'
    //   extra.return_url = 'http://127.0.0.1/return'
    //   extra.activate_url = 'http://127.0.0.1/activate'
    //   extra.has_header = true
    //   break
    // case 'cmb_wallet':
    //   extra.result_url = 'https://127.0.0.1/result'
    //   extra.p_no = '2016062901'
    //   extra.seq = '2016062901'
    //   extra.m_uid = '2016062901'
    //   extra.mobile = '18512343456'
    //   break
  }

  return extra
}

function createCharge(chargeOptions) {
  return new Promise(function(resolve, reject) {
    pingpp.charges.create(chargeOptions, function(err, charge) {
      if (err) {
        return reject(err)
      }

      resolve(charge)
    })
  })
}

function pay(channel, clientIP, userId, userName, durationInYear) {
  var extra = buildExtra(channel)

  return SettingManager.findOne()
    .then(function(setting) {

      if (setting.membershipAnnualPrice <= 0) {
        return {};
      }

      var chargeOptions = {
        order_no:  generateOrderNo(channel),
        app:       { id: config.pingpp.appId },
        channel:   channel,
        amount:    durationInYear * setting.membershipAnnualPrice * 100, // 单位为分
        client_ip: clientIP,
        currency:  'cny',
        subject:   '浓缩书会员费',
        body:      '浓缩书会员费',
        extra:     extra
      }

      return chargeOptions
    })
    .then(createCharge)
    .then(function(charge) {
      return paymentHistoryModel.create({
        userId: userId,
        userName: userName,
        orderNo: charge.order_no,
        chargeId: charge.id,
        chargeObj: charge,
        channel: charge.channel,
        paidMonth: durationInYear * 12,
        amount: charge.amount,
        amountSettle: 0
      })
    })
}

function saveChargeEvent(chargeEvent) {
  var chargeData = chargeEvent.data.object

  return paymentHistoryModel.findOne({chargeId: chargeData.id})
    .then(function(paymentHistory) {
      if (!paymentHistory) {
        throw new Error('NO_CHARGE_HISTORY')
      }

      var userPaidTime = chargeData.time_paid * 1000
      var timePaid = moment(userPaidTime)
      var timeExpire = moment(userPaidTime).add(paymentHistory.paidMonth / 12, 'y')

      paymentHistory.chargeEventId = chargeEvent.id
      paymentHistory.chargeEventObj = chargeEvent
      paymentHistory.paidOn = timePaid.format('YYYY-MM-DD')
      paymentHistory.expiredOn = timeExpire.format('YYYY-MM-DD')
      paymentHistory.amountSettle = chargeData.amount_settle

      return paymentHistory.save()
    })
    .then(function(paymentHistory) {
      return UserManager.update({
        _id: paymentHistory.userId,
        paidOn: paymentHistory.paidOn,
        expiredOn: paymentHistory.expiredOn,
        paidMonth: paymentHistory.paidMonth
      })
    })
}

function isChargePaid(chargeId) {
  return paymentHistoryModel.findOne({chargeId: chargeId})
    .sort({updatedAt: -1})
    .then(function(paymentHistory) {
      return !!paymentHistory.chargeEventId
    })
}

function verifySignature(rawData, signature) {
  var verifier = crypto.createVerify('RSA-SHA256').update(rawData, 'utf8')

  return readFile(config.pingpp.publicKeyPath, 'utf8')
    .then(function(pubKey) {
      return verifier.verify(pubKey, signature, 'base64')
    })
}
