# generator-evergrow [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> Opinionated web application generator

This generator is time-saver when you want to quickly bootstrap a web application based on my opinionated code structure.  It's based on Express 4, uses MongoDB for persistence and Redis for session storage.  

## Installation

First, install [Yeoman](http://yeoman.io) and generator-evergrow using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-evergrow
```

### Web Application Bootstrap

Then generate your new web application in your application folder through below command.  It will prompt you to provide the project name and git url:  

```bash
yo evergrow
```

After it completes, perform below two steps before running the application:  

1. Duplicate file `config/base/sample.js` and rename to `config/base/development.js`.  Change any option you need to match your MongoDB, Redis URL, etc.  
2. Type `npm install` and it knows how to install all the dependencies.  

After all dependent packages are installed, you can start the application by `node index.js`.  You can see the home page immediately by accessing the application through URL `http://localhost:3000` (assuming you have not changed port in config).

![Application Home](http://thinkingincrowd.u.qiniudn.com/generator-evergrow-home.png)

This application already supports local user signup, signin and signout functiontalities.  You can see below user profile page after you signup and login.  

![User Profile](http://thinkingincrowd.u.qiniudn.com/generator-evergrow-user-profile.png)

### New Module Generation

There are three sub-generators: `module`, `model` and `view`.  Actually, the `module` sub-generator is composed by the other two.  What are the difference between them and when to use them?  

1. Create a new module with backend model, controller and business layer only, type command: `yo evergrow:model Demo`.  `Demo` is the module name.
2. Create a new module with all backend stuff and views, type command: `yo evergrow:module Demo`.  
3. If you only want to have sample views, type `yo evergrow:view Demo`

If you create a complete module, you can see below files are automatically generated:  

![Sample Module](http://thinkingincrowd.u.qiniudn.com/generator-evergrow-sample-module.png)

What are those files for?  Take a look after you generate it.  You should have some sense if you have basic web development background.  

New to web application development?  I will write tutorials later.  Cheers.  :)


## License

MIT © [Ken Chen](http://www.thinkingincrowd.me)


[npm-image]: https://badge.fury.io/js/generator-evergrow.svg
[npm-url]: https://npmjs.org/package/generator-evergrow
[travis-image]: https://travis-ci.org/kenspirit/generator-evergrow.svg?branch=master
[travis-url]: https://travis-ci.org/kenspirit/generator-evergrow
[daviddm-image]: https://david-dm.org/kenspirit/generator-evergrow.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/kenspirit/generator-evergrow
