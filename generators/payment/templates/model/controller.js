var PaymentManager = require('./payment-manager')
var buildApiResponse = require('../../system/util').buildApiResponse
var logger = require('../../system/log-manager')

module.exports.pay = pay
module.exports.payByChannelOne = payByChannelOne
module.exports.updatePaymentStatus = updatePaymentStatus
module.exports.getPaymentStatus = getPaymentStatus
module.exports.successPage = successPage
module.exports.cancelPage = cancelPage

function pay(req, res, next) {
  var userId = req.user ? req.user._id : '5799b9149ec3a78541a17867'
  var userName = req.user ? req.user.name : 'ken'
  var clientIP = '127.0.0.1' || req.ip

  PaymentManager.pay(
      req.params.channel, clientIP, userId, userName, req.body.duration)
    .then(function(paymentHistory) {
      res.json(buildApiResponse(paymentHistory.chargeObj))
    })
    .catch(next)
}

function payByChannelOne(req, res, next) {
  var userId = req.user ? req.user._id : '5799b9149ec3a78541a17867'
  var userName = req.user ? req.user.name : 'ken'
  var clientIP = '127.0.0.1' || req.ip

  PaymentManager.pay(
      req.body.channel, clientIP, userId, userName, req.body.duration)
    .then(function(paymentHistory) {
      res.json(paymentHistory.chargeObj)
    })
    .catch(next)
}

function updatePaymentStatus(req, res, next) {
  var header = req.get('x-pingplusplus-signature')

  var event = req.body
  if (!event.type) {
    return res.status(500).send('Event 对象中缺少 type 字段')
  }

  // Verify Sender
  PaymentManager.verifySignature(JSON.stringify(req.body), header)
    .then(function(verifyResult) {
      if (!verifyResult) {
        res.status(403).send('Forbidden')
        return
      }

      switch (event.type) {
        case 'charge.succeeded':
          PaymentManager.saveChargeEvent(event)
            .then(function() {
              res.status(200).send('OK')
            })
            .catch(function(err) {
              logger.error({req: req, err: err}, 'PaymentManager.saveChargeEvent')

              res.status(500).json(buildApiResponse(err.message, err))
            })

          break
        case 'refund.succeeded':
          // 开发者在此处加入对退款异步通知的处理代码
          // return resp('OK', 200)
          break
        default:
          return res.status(500).send('未知 Event 类型')
          break
      }
    })
    .catch(next)
}

function getPaymentStatus(req, res, next) {
  PaymentManager.isChargePaid(req.params.chargeId)
    .then(function(isPaid) {
      res.json(buildApiResponse(isPaid))
    })
    .catch(next)
}

function successPage(req, res, next) {
  res.render('web/paymentSuccess', {currentUser: req.user})
}

function cancelPage(req, res, next) {
  res.render('web/paymentCancel', {currentUser: req.user})
}
