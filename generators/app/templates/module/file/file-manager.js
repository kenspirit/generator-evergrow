var fs = require('fs')
var Promise = require('bluebird')
var config = require('../../system/config-manager').getConfig()

var writeFile = Promise.promisify(fs.writeFile)

module.exports.uploadFile = uploadFile

function uploadFile(fileName, file) {
  var filePath = config.upload.path + fileName

  return writeFile(filePath, file)
    .then(function() {
      return filePath
    })
}
