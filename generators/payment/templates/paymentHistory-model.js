var mongoose = require('mongoose')
var Schema = mongoose.Schema

var paymentHistorySchema = new Schema({
  userId: Schema.Types.ObjectId,
  userName: String,
  orderNo: String,
  chargeId: String,
  chargeObj: Schema.Types.Mixed,
  chargeEventId: String,
  chargeEventObj: Schema.Types.Mixed,
  channel: String,
  amount: Number,
  amountSettle: Number
}, {strict: false, timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt'}})

module.exports = mongoose.model('PaymentHistory', paymentHistorySchema)
