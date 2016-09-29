'use strict'
var yeoman = require('yeoman-generator')
var chalk = require('chalk')
var yosay = require('yosay')
var _ = require('lodash')

module.exports = yeoman.Base.extend({
  initializing : function () {
  },

  writing: {
    package: function () {
      var newPackage = this.fs.readJSON(this.templatePath('package.json'))
      var originPackage = this.fs.readJSON(this.destinationPath('package.json'))

      _.forEach(newPackage.dependencies, function(version, key) {
        if (originPackage.dependencies[key]) {
          console.log('Package ' + key + ' already exists.')
        } else {
          originPackage.dependencies[key] = version
        }
      })

      this.fs.writeJSON(
        this.destinationPath('package.json'),
        originPackage
      )
    },
    config: function() {
      this.fs.copy(
        this.templatePath('config.js'),
        this.destinationPath('config/sms/development.js')
      )
    },
    server: function() {
      this.fs.copy(
        this.templatePath('sms-manager.js'),
        this.destinationPath('system/sms-manager.js')
      )
    }
  }
})
