'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-evergrow:app', function () {
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({someAnswer: true})
      .toPromise();
  });

  it('creates files', function () {
    assert.file([
      '.gitignore',
      'package.json',
      'gulpfile.js',
      'gulp',
      'ecosystem.json',
      'config',
      'index.js',
      'module',
      'system',
      'view',
      'public'
    ]);
  });
});
