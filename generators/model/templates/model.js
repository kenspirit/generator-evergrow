var mongoose = require('mongoose')
var Schema = mongoose.Schema

var <%= modulename %>Schema = new Schema({
  createdUserId: {type: Schema.Types.ObjectId, required: true},
  createdUser: {type: String, required: true},
  updatedUserId: {type: Schema.Types.ObjectId, required: true},
  updatedUser: {type: String, required: true},
  deleted: {type: Boolean, default: false}
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt'}})

module.exports = mongoose.model('<%= modulename %>', <%= modulename %>Schema)
