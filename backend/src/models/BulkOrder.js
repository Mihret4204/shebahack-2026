const mongoose = require('mongoose');

const bulkOrderSchema = new mongoose.Schema({
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: ['requested', 'quoted', 'accepted', 'in_progress', 'completed', 'cancelled'], 
    default: 'requested' 
  },
  items: [{
    itemType: { type: String, enum: ['product', 'service'], required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId },
    itemName: String,
    quantity: { type: Number, required: true },
    requestedPrice: Number,
    quotedPrice: Number
  }],
  totalAmount: Number,
  deliverySchedule: {
    frequency: { type: String, enum: ['once', 'daily', 'weekly', 'monthly'] },
    startDate: Date,
    endDate: Date
  },
  deliveryAddress: {
    city: String,
    subcity: String,
    specificLocation: String,
    phone: String
  },
  notes: String,
  paymentTerms: String
}, { timestamps: true });

module.exports = mongoose.model('BulkOrder', bulkOrderSchema);
