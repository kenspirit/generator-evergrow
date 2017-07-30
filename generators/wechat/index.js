'use strict'
var yeoman = require('yeoman-generator')
var chalk = require('chalk')
var yosay = require('yosay')
var pluralize = require('pluralize')
var _ = require('lodash')

module.exports = yeoman.Base.extend({
  modulename: 'wechat',
  constructor: require('../common/moduleConstructor').ModuleConstructor,
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
    model: function() {
      var moduleTemplates =
        ['routes.js', 'manager.js', 'controller.js']
      var that = this

      moduleTemplates.forEach(function(template) {
        that.fs.copyTpl(
          that.templatePath('model/' + template),
          that.destinationPath(
            'module/' + that.modulenameLowerCase + '/'
            + that.modulenameLowerCase + '-' + template
          ),
          {
            modulename: that.modulename,
            modulenameLowerCase: that.modulenameLowerCase,
            modulenamePluralized: that.modulenamePluralized
          }
        )
      })
    },
    config: function() {
      this.fs.copy(
        this.templatePath('config.js'),
        this.destinationPath('config/wechat/sample.js')
      )
    },
  }
})
