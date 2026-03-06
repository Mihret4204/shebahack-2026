const Service = require('../models/Service');

exports.createService = async (req, res) => {
  try {
    const service = await Service.create({ ...req.body, provider: req.user.id });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const services = await Service.find(filter).populate('provider', 'name email');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('provider', 'name email');
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, provider: req.user.id },
      req.body,
      { new: true }
    );
    if (!service) return res.status(404).json({ message: 'Service not found or unauthorized' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({ _id: req.params.id, provider: req.user.id });
    if (!service) return res.status(404).json({ message: 'Service not found or unauthorized' });
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
