const mongoose = require('mongoose');

const lineItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 }
});

const invoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  invoiceNumber: { type: String, required: true },
  lineItems: [lineItemSchema],
  subtotal: { type: Number, required: true, default: 0 },
  taxRate: { type: Number, required: true, default: 0 }, // as a percentage
  taxAmount: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true, default: 0 },
  dueDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['draft', 'sent', 'paid', 'overdue'], 
    default: 'draft' 
  }
}, {
  timestamps: true
});

// Compound index to ensure uniqueness of invoice number per user
invoiceSchema.index({ userId: 1, invoiceNumber: 1 }, { unique: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
