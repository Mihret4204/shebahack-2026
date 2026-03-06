const mongoose = require('mongoose');

const financialContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleAmharic: String,
  description: { type: String, required: true },
  descriptionAmharic: String,
  contentType: { type: String, enum: ['video', 'article', 'tip'], required: true },
  category: { 
    type: String, 
    enum: ['pricing', 'saving', 'business_growth', 'marketing', 'budgeting', 'other'],
    required: true 
  },
  content: String,
  contentAmharic: String,
  videoUrl: String,
  thumbnailUrl: String,
  duration: String, // For videos
  isActive: { type: Boolean, default: true },
  views: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('FinancialContent', financialContentSchema);
