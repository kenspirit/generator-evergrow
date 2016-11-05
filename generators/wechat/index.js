'use strict'
var yeoman = require('yeoman-generator')
var chalk = require('chalk')
var yosay = require('yosay')
var pluralize = require('pluralize')
var _ = require('lodash')

module.exports = yeoman.Base.extend({
  writing: {
    model: function() {
      var moduleTemplates =
        ['routes.js', 'model.js', 'manager.js', 'controller.js']
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
