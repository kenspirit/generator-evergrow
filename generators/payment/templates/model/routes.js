var joi = require('joi')
var AuthController = require('../auth/auth-controller')
var PaymentController = require('./payment-controller')

module.exports.basePath = '/payment'
module.exports.routes = [
  {
    method: 'get',
    path: '/paymentSuccess',
    summary: 'Payment Success Page',
    description: '',
    action: PaymentController.successPage
  },
  {
    method: 'get',
    path: '/paymentCancel',
    summary: 'Payment Cancel Page',
    description: '',
    action: PaymentController.cancelPage
  },
  {
    method: 'post',
    path: '/channel/:channel',
    summary: 'Payment',
    description: 'Payment',
    action: [AuthController.ensureAuthenticated, PaymentController.pay],
    validators: {
      path: joi.object().keys({
        channel: joi.string().valid('wx_pub'
          // Enable your payment methods here
          // 'alipay_qr', 'alipay_wap', 'alipay_pc_direct'
          // , 'upacp_wap', 'upacp_pc'
          // , 'wx', 'wx_pub_qr', 'wx_wap', 'alipay', 'bfb', 'bfb_wap'
          // , 'upacp', 'cp_b2b', 'yeepay_wap'
          // , 'jdpay_wap', 'cnp_u', 'cnp_f', 'applypay_upacp', 'fqlpay_wap'
          // , 'qgbc_wap', 'cmb_wallet'
        )
      })
    }
  },
  {
    method: 'post',
    path: '/channelOne',
    summary: 'Payment',
    description: 'Payment',
    action: [AuthController.ensureAuthenticated, PaymentController.payByChannelOne],
    validators: {
      body: joi.object().keys({
        channel: joi.string().required(),
        amount: joi.number(),
        order_no: joi.string(),
        open_id: joi.string()
      })
    }
  },
  {
    method: 'post',
    path: '/updatePaymentStatus',
    summary: 'Accepting receipt from Ping++',
    description: 'Accepting receipt from Ping++',
    action: PaymentController.updatePaymentStatus
  },
  {
    method: 'get',
    path: '/paymentStatus/:chargeId',
    summary: 'Allows client to poll payment status when using QR',
    description: 'Allows client to poll payment status when using QR',
    action: [AuthController.ensureAuthenticated, PaymentController.getPaymentStatus]
  }
]
