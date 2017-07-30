'use strict'
var yeoman = require('yeoman-generator')
var pluralize = require('pluralize')

module.exports.ModuleConstructor = function () {
  yeoman.Base.apply(this, arguments)

  if (!this.modulename) {
    this.argument('modulename', { type: String, required: true })
  }
  this.modulename = this.modulename
  this.modulenameLowerCase = this.modulename.toLowerCase()
  this.modulenamePluralized = pluralize(this.modulename)
}
