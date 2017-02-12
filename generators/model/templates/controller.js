var <%= modulename %>Manager = require('./<%= modulenameLowerCase %>-manager')
var buildApiResponse = require('../../system/util').buildApiResponse
var parseRequestParams = require('../../system/util').parseRequestParams
var parseResultForTable = require('../../system/util').parseResultForTable
var logger = require('../../system/log-manager')

module.exports = {
  list<%= modulename %>Page: list<%= modulename %>Page,
  load<%= modulename %>Page: load<%= modulename %>Page,
  list<%= modulename %>: list<%= modulename %>,
  load<%= modulename %>: load<%= modulename %>,
  create<%= modulename %>: create<%= modulename %>,
  update<%= modulename %>: update<%= modulename %>,
  remove<%= modulename %>: remove<%= modulename %>
}

function list<%= modulename %>Page(req, res, next) {
  res.render('<%= modulenameLowerCase %>/<%= modulenameLowerCase %>List')
}

function load<%= modulename %>Page(req, res, next) {
  res.render('<%= modulenameLowerCase %>/<%= modulenameLowerCase %>Profile', {
    id: req.params.id
  })
}

function list<%= modulename %>(req, res, next) {
  var params = parseRequestParams(req)
  <%= modulename %>Manager.list(params)
    .then(function(entities) {
      return res.json(parseResultForTable(entities))
    })
    .catch(next)
}

function load<%= modulename %>(req, res, next) {
  <%= modulename %>Manager.load(req.params.id)
    .then(function(entity) {
      return res.json(buildApiResponse(entity))
    })
    .catch(next)
}

function create<%= modulename %>(req, res, next) {
  var requestEntity = req.body

  <%= modulename %>Manager.create(requestEntity)
    .then(function(createdEntity) {
      return res.json(buildApiResponse(createdEntity))
    })
    .catch(next)
}

function update<%= modulename %>(req, res, next) {
  var requestEntity = req.body
  requestEntity._id = req.params.id

  <%= modulename %>Manager.update(requestEntity)
    .then(function(updatedEntity) {
      return res.json(buildApiResponse(updatedEntity))
    })
    .catch(next)
}

function remove<%= modulename %>(req, res, next) {
  <%= modulename %>Manager.remove(req.params.id)
    .then(function() {
      return res.json(buildApiResponse(true))
    })
    .catch(next)
}
