'use strict'
var yeoman = require('yeoman-generator')
var chalk = require('chalk')
var yosay = require('yosay')
var pluralize = require('pluralize')
var _ = require('lodash')

module.exports = yeoman.Base.extend({
  constructor: require('../../common/moduleConstructor').ModuleConstructor,
  writing: {
    view: function() {
      var that = this
      var options = {
        modulename: that.modulename,
        modulenameLowerCase: that.modulenameLowerCase,
        modulenamePluralized: that.modulenamePluralized
      }

      ;['List.html', 'Profile.html'].forEach(function(template) {
        that.fs.copyTpl(
          that.templatePath('view/' + template),
          that.destinationPath(
            'view/' + that.modulenameLowerCase + '/'
            + that.modulenameLowerCase + template
          ),
          options
        )
      })

      ;['List.js', 'Profile.js'].forEach(function(template) {
        that.fs.copyTpl(
          that.templatePath('js/' + template),
          that.destinationPath(
            'public/js/' + that.modulenameLowerCase + '/'
            + that.modulenameLowerCase + template
          ),
          options
        )
      })
    }
  }
})
