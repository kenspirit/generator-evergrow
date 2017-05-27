const test = require('ava')
const mongoose = require('mongoose')
const <%= modulename %>Manager = require('../../../module/<%= modulenameLowerCase %>/<%= modulenameLowerCase %>-manager')
const DbManager = require('../../..//system/db-manager')

test.before('Init', async t => {
  await DbManager.initDB()
})

let createdData = null;

test.serial('Creation', async t => {
  const data = {
    createdUserId: new mongoose.Types.ObjectId(),
    createdUser: 'Created',
    updatedUserId: new mongoose.Types.ObjectId(),
    updatedUser: 'Created'
  }

  createdData = await <%= modulename %>Manager.create(data)

  t.truthy(createdData._id)

  for (let key in data) {
    t.truthy(data[key] === createdData[key])
  }
})

test.serial('List', async t => {
  const result = await <%= modulename %>Manager.list({ _id: createdData._id })

  t.truthy(result.totalCount === 1)
  t.truthy(String(result.records[0]._id) === String(createdData._id))
})

test.serial('Load', async t => {
  const result = await <%= modulename %>Manager.load(createdData._id)

  t.truthy(result)
  t.truthy(String(result._id) === String(createdData._id))
})

test.serial('Update', async t => {
  const data = {
    _id: createdData._id,
    createdUser: 'Updated',
    updatedUser: 'Updated'
  }

  const result = await <%= modulename %>Manager.update(data)

  for (let key in data) {
    t.truthy(String(data[key]) === String(result[key]))
  }
})

test.serial('Remove', async t => {
  await <%= modulename %>Manager.remove(createdData._id, true)

  const result = await <%= modulename %>Manager.load(createdData._id)

  t.falsy(result)
})

test.after('cleanup', async t => {
  await DbManager.disconnectDB()
})
