const BulkOrder = require('../models/BulkOrder');

exports.createBulkOrder = async (req, res) => {
  try {
    const bulkOrder = await BulkOrder.create({ ...req.body, organization: req.user.id });
    res.status(201).json(bulkOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBulkOrders = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'organization') {
      filter.organization = req.user.id;
    } else if (req.user.role === 'vendor') {
      filter.vendor = req.user.id;
    }
    
    const orders = await BulkOrder.find(filter)
      .populate('organization', 'businessName phone')
      .populate('vendor', 'name phone location')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBulkOrder = async (req, res) => {
  try {
    const bulkOrder = await BulkOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bulkOrder) return res.status(404).json({ message: 'Bulk order not found' });
    res.json(bulkOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
