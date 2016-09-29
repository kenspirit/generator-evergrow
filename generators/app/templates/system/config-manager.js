var fs = require('fs')
var path = require('path')

module.exports.getConfig = getConfig

var env = process.env.NODE_ENV || 'development'

var configDirs = fs.readdirSync(path.resolve(__dirname, '../config'))
var configObj = {}

configDirs.forEach(function(dirName) {
  var config = require('../config/' + dirName + '/' + env)
  configObj[dirName] = config
})

function getConfig() {
  return configObj
}
