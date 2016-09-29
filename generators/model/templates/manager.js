var _ = require('lodash')
var <%= modulename %>Model = require('./<%= modulenameLowerCase %>-model')
var executeQuery = require('../../system/db-manager').executeQuery

module.exports = {
  list: list,
  load: load,
  create: create,
  update: update,
  remove: remove
}

function list(queryRequest) {
  return executeQuery(<%= modulename %>Model, queryRequest)
}

function load(id) {
  return <%= modulename %>Model.findOne({_id: id}).exec()
}

function create(entity) {
  return <%= modulename %>Model.create(entity)
}

function update(entity) {
  return load(entity._id)
    .then(function(dbEntity) {
      if (!dbEntity) {
        return false
      }
      delete entity._id

      _.assign(dbEntity, entity)

      return dbEntity.save()
    })
}

function remove(entityId, isPhysical) {
  if (!isPhysical) {
    return <%= modulename %>Model.update({_id: entityId}, {deleted: true}).exec()
  } else {
    return <%= modulename %>Model.remove({_id: entityId})
  }
}
