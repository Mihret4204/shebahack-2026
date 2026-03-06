const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  itemType: { type: String, enum: ['product', 'service', 'vendor'], required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId },
  ratings: {
    quality: { type: Number, required: true, min: 1, max: 5 },
    reliability: { type: Number, required: true, min: 1, max: 5 },
    service: { type: Number, required: true, min: 1, max: 5 }
  },
  overallRating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  commentAmharic: String,
  isApproved: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
