'use strict'
var yeoman = require('yeoman-generator')
var chalk = require('chalk')
var yosay = require('yosay')
var pluralize = require('pluralize')
var _ = require('lodash')

module.exports = yeoman.Base.extend({
  constructor: require('../common/moduleConstructor').ModuleConstructor,
  writing: {
    module: function() {
      this.composeWith('generator:model', {
        arguments: [this.modulename]
      }, {
        local: require.resolve('../model')
      })

      this.composeWith('generator:view', {
        arguments: [this.modulename]
      }, {
        local: require.resolve('../view')
      })
    }
  }
})
