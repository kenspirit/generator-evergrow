'use strict'
var path = require('path')
var assert = require('yeoman-assert')
var helpers = require('yeoman-test')

describe('generator-evergrow:view', function () {
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/view'))
      .withArguments(['Message'])
      .toPromise()
  })

  it('creates files', function () {
    assert.file([
      'view/message',
      'public/js/message'
    ])
  })
})
