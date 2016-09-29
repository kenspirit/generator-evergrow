var <%= modulename %>Manager = require('./<%= modulenameLowerCase %>-manager')
var buildApiResponse = require('../../system/util').buildApiResponse
var logger = require('../../system/log-manager')

module.exports.list<%= modulename %>Page = list<%= modulename %>Page
module.exports.load<%= modulename %>Page = load<%= modulename %>Page
module.exports.list<%= modulename %> = list<%= modulename %>
module.exports.load<%= modulename %> = load<%= modulename %>
module.exports.create<%= modulename %> = create<%= modulename %>
module.exports.update<%= modulename %> = update<%= modulename %>
module.exports.remove<%= modulename %> = remove<%= modulename %>

function list<%= modulename %>Page(req, res, next) {
  res.render('<%= modulenameLowerCase %>/<%= modulenameLowerCase %>List')
}

function load<%= modulename %>Page(req, res, next) {
  res.render('<%= modulenameLowerCase %>/<%= modulenameLowerCase %>Profile', {
    id: req.params.id
  })
}

function list<%= modulename %>(req, res, next) {
  <%= modulename %>Manager.list(req.query)
    .then(function(entities) {
      res.json(buildApiResponse(entities))
    })
    .catch(next)
}

function load<%= modulename %>(req, res, next) {
  <%= modulename %>Manager.load(req.params.id)
    .then(function(entity) {
      res.json(buildApiResponse(entity))
    })
    .catch(next)
}

function create<%= modulename %>(req, res, next) {
  var requestEntity = req.body

  <%= modulename %>Manager.create(requestEntity)
    .then(function(createdEntity) {
      res.json(buildApiResponse(createdEntity))
    })
    .catch(next)
}

function update<%= modulename %>(req, res, next) {
  var requestEntity = req.body
  requestEntity._id = req.params.id

  <%= modulename %>Manager.update(requestEntity)
    .then(function(updatedEntity) {
      res.json(buildApiResponse(updatedEntity))
    })
    .catch(next)
}

function remove<%= modulename %>(req, res, next) {
  <%= modulename %>Manager.remove(req.params.id)
    .then(function() {
      res.json(buildApiResponse(true))
    })
    .catch(next)
}
