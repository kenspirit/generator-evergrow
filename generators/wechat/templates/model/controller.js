var _ = require('lodash')
var Promise = require('bluebird')
var moment = require('moment')
var passport = require('passport')
var request = require('request')
var through2 = require('through2')

var WechatManager = require('./wechat-manager')
var QnManager = require('../../system/qn-manager')
var buildApiResponse = require('../../system/util').buildApiResponse

module.exports.wechatAuth = wechatAuth
module.exports.demo = demo

function wechatAuth() {
  return function(req, res, next) {
    if (req.user) {
      // Login before and in session.  No need auth again
      next()
      return
    } else {
      if (req.xhr) {
        // ajax request
        res.status(403).json(buildApiResponse(null, 'Login required.'))
      } else {
        passport.authenticate('wechat')(req, res, next)
      }
    }
  }
}

module.exports.wechatMsg = WechatManager.getWechatRouter(function(req, res, next) {
  // 微信输入信息都在req.weixin上
  var message = req.weixin

  res.reply('')
})

function demo(req, res, next) {
  var debug = true
  var jsApiList = ['onMenuShareTimeline', 'onMenuShareAppMessage','hideOptionMenu','showOptionMenu']
  var url = req.protocol + '://' + req.hostname + '/' + req.url

  WechatManager.getJsConfig(url, jsApiList, debug)
    .then(function(config) {
      var userInfo = _.cloneDeep(req.user)
      userInfo.jsConfig = config

      res.render('wechat/demo', {
        user: userInfo
      })
    })
    .catch(next)
}
