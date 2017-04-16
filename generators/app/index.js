'use strict'
var yeoman = require('yeoman-generator')
var chalk = require('chalk')
var yosay = require('yosay')

module.exports = yeoman.Base.extend({
  initializing : function () {
    // this.composeWith('evergrow:module')
  },
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the funkadelic ' + chalk.red('generator-evergrow') + ' generator!'
    ))

    var prompts = [{
      type: 'input',
      name: 'appname',
      message: 'Please input your project name.',
      default: this.appname
    },
    {
      type: 'input',
      name: 'repo',
      message: 'Please input your git repository url.'
    }]

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer
      this.props = props
      this.appname = this.props.appname
      this.repo = this.props.repo
    }.bind(this))
  },

  writing: {
    git: function () {
      this.fs.copy(
        this.templatePath('_gitignore'),
        this.destinationPath('.gitignore')
      )
    },
    package: function () {
      var content = this.fs.readJSON(this.templatePath('package.json'))
      content.name = this.props.appname

      this.fs.writeJSON(
        this.destinationPath('package.json'),
        content
      )
    },
    gulp: function() {
      this.fs.copy(
        this.templatePath('gulpfile.js'),
        this.destinationPath('gulpfile.js')
      )

      this.fs.copy(
        this.templatePath('gulp/'),
        this.destinationPath('gulp/')
      )
    },
    pm2: function() {
      var content = this.fs.readJSON(this.templatePath('ecosystem.json'))
      content.apps[0].name = this.appname

      content.deploy.production.repo = this.repo || ''

      this.fs.writeJSON(
        this.destinationPath('ecosystem.json'),
        content
      )
    },
    config: function() {
      this.fs.copy(
        this.templatePath('config/'),
        this.destinationPath('config/')
      )
    },
    server: function() {
      this.fs.copy(
        this.templatePath('Makefile'),
        this.destinationPath('Makefile')
      )

      this.fs.copy(
        this.templatePath('index.js'),
        this.destinationPath('index.js')
      )

      this.fs.copy(
        this.templatePath('module/file/'),
        this.destinationPath('module/file/')
      )

      this.fs.copy(
        this.templatePath('module/home/'),
        this.destinationPath('module/home/')
      )

      this.fs.copy(
        this.templatePath('system/'),
        this.destinationPath('system/')
      )

      // Common views
      this.fs.copy(
        this.templatePath('view/common/'),
        this.destinationPath('view/common/')
      )
      this.fs.copy(
        this.templatePath('view/404.html'),
        this.destinationPath('view/404.html')
      )
      this.fs.copy(
        this.templatePath('view/500.html'),
        this.destinationPath('view/500.html')
      )
      this.fs.copy(
        this.templatePath('view/index.html'),
        this.destinationPath('view/index.html')
      )
    },
    auth: function() {
      // User Module
      this.fs.copy(
        this.templatePath('module/user/'),
        this.destinationPath('module/user/')
      )

      this.fs.copy(
        this.templatePath('view/user/'),
        this.destinationPath('view/user/')
      )

      // Auth Module
      this.fs.copy(
        this.templatePath('module/auth/'),
        this.destinationPath('module/auth/')
      )

      this.fs.copy(
        this.templatePath('view/auth/'),
        this.destinationPath('view/auth/')
      )
    },
    publicAsset: function() {
      // to be remove and use npm & build script later
      this.fs.copy(
        this.templatePath('public/'),
        this.destinationPath('public/')
      )
    }
  }
})
