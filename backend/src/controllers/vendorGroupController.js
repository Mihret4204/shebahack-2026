const VendorGroup = require('../models/VendorGroup');

exports.createGroup = async (req, res) => {
  try {
    const group = await VendorGroup.create({ ...req.body, admin: req.user.id, members: [req.user.id] });
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllGroups = async (req, res) => {
  try {
    const { category, location } = req.query;
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (location) filter['location.city'] = { $regex: location, $options: 'i' };

    const groups = await VendorGroup.find(filter)
      .populate('admin', 'name phone')
      .populate('members', 'name skills location');
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.joinGroup = async (req, res) => {
  try {
    const group = await VendorGroup.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    
    if (group.members.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already a member' });
    }
    
    group.members.push(req.user.id);
    await group.save();
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
