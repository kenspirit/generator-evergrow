'use strict'
var path = require('path')
var assert = require('yeoman-assert')
var helpers = require('yeoman-test')

describe('generator-evergrow:module', function () {
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/module'))
      .withArguments(['Message'])
      .toPromise()
  })

  it('creates files', function () {
    assert.file([
      'module/message',
      'view/message',
      'public/js/message'
    ])
  })
})
