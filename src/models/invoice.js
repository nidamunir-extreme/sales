const mongoose = require('mongoose');
const invoiceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  total: Number,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Invoice', invoiceSchema);
