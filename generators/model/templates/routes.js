var joi = require('joi')
var <%= modulename %>Controller = require('./<%= modulenameLowerCase %>-controller')

module.exports.basePath = '/<%= modulenameLowerCase %>'
module.exports.routes = [
  {
    method: 'get',
    path: '/page/load/:id',
    summary: 'Load <%= modulename %> profile page',
    description: '',
    action: <%= modulename %>Controller.load<%= modulename %>Page
  },
  {
    method: 'get',
    path: '/page/load',
    summary: '<%= modulename %> Create page',
    description: '',
    action: <%= modulename %>Controller.load<%= modulename %>Page
  },
  {
    method: 'get',
    path: '/page/list',
    summary: '<%= modulename %> list page',
    description: '',
    action: <%= modulename %>Controller.list<%= modulename %>Page
  },
  {
    method: 'get',
    path: '/',
    summary: 'Gets all <%= modulename %>s',
    description: '',
    action: <%= modulename %>Controller.list<%= modulename %>,
    validators: {
      query: joi.object().keys({
        search: joi.string().allow(''),
        order: joi.string().valid('desc', 'asc').default('asc'),
        limit: joi.number().integer().max(100).default(10),
        offset: joi.number().integer()
      })
    }
  },
  {
    method: 'post',
    path: '/',
    summary: 'Creates <%= modulename %>',
    description: '',
    action: <%= modulename %>Controller.create<%= modulename %>
  },
  {
    method: 'get',
    path: '/:id',
    summary: 'Load <%= modulename %> profile',
    description: '',
    action: <%= modulename %>Controller.load<%= modulename %>
  },
  {
    method: 'post',
    path: '/:id',
    summary: 'Updates <%= modulename %> profile',
    description: '',
    action: <%= modulename %>Controller.update<%= modulename %>
  },
  {
    method: 'delete',
    path: '/:id',
    summary: 'Deletes <%= modulename %>',
    description: '',
    action: <%= modulename %>Controller.remove<%= modulename %>
  }
]
