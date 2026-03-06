const FinancialContent = require('../models/FinancialContent');

exports.getAllContent = async (req, res) => {
  try {
    const { category, contentType, language } = req.query;
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (contentType) filter.contentType = contentType;

    const content = await FinancialContent.find(filter).sort({ createdAt: -1 });
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getContentById = async (req, res) => {
  try {
    const content = await FinancialContent.findById(req.params.id);
    if (!content) return res.status(404).json({ message: 'Content not found' });
    
    // Increment views
    content.views += 1;
    await content.save();
    
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createContent = async (req, res) => {
  try {
    const content = await FinancialContent.create(req.body);
    res.status(201).json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
