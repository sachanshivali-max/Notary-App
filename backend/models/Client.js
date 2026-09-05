const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  billingAddress: { type: String, default: '' },
}, {
  timestamps: true
});

module.exports = mongoose.model('Client', clientSchema);
