const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    itemType: { type: String, enum: ['product', 'service'], required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    quantity: { type: Number, default: 1 },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
