var WechatManager = require('./wechat-manager')

module.exports.wechatMsg = WechatManager.getWechatRouter(function(req, res, next) {
  // 微信输入信息都在req.weixin上
  var message = req.weixin
  console.log(message);

  res.reply('')
})
