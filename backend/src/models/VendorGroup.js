const mongoose = require('mongoose');

const vendorGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameAmharic: String,
  description: String,
  descriptionAmharic: String,
  category: { 
    type: String, 
    enum: ['cooking', 'craft_making', 'textile_work', 'services', 'other'],
    required: true 
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: {
    city: String,
    subcity: String
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('VendorGroup', vendorGroupSchema);
