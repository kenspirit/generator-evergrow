var Busboy = require('busboy')
var uuid = require('node-uuid')
var path = require('path')
var qiniu = require('qiniu')
var Promise = require('bluebird')
var logger = require('./log-manager')
var config = require('./config-manager').getConfig()

var putFile = Promise.promisify(qiniu.io.putFile)
var putReadable = Promise.promisify(qiniu.io.putReadable)

//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = config.qn.accessKey
qiniu.conf.SECRET_KEY = config.qn.secretKey

//要上传的空间
var bucket = config.qn.bucket

//构建上传策略函数
function uptoken(bucket, key) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket + ':' + key)
  return putPolicy.token()
}

//构造上传函数
function uploadFile(key, localFile) {
  //生成上传 Token
  var token = uptoken(bucket, key)

  var extra = new qiniu.io.PutExtra()
  return putFile(token, key, localFile, extra)
}

function uploadRequestFile(key, reqFile) {
  //生成上传 Token
  var token = uptoken(bucket, key)

  var extra = new qiniu.io.PutExtra()
  return putReadable(token, key, reqFile, extra)
}

function removeFile(key) {
  var client = new qiniu.rs.Client()

  client.remove(bucket, key, function(err, ret) {
    if (!err) {
      console.log('done')
    } else {
      console.log(err);
    }
  })
}

function fileInfo(key) {
  var client = new qiniu.rs.Client()

  client.stat(bucket, key, function(err, ret) {
    if (!err) {
      console.log(ret)
    } else {
      console.log(err);
    }
  })
}

module.exports.fileInfo = fileInfo
module.exports.removeFile = removeFile
module.exports.uploadFile = uploadFile
module.exports.uploadRequestFile = uploadRequestFile
