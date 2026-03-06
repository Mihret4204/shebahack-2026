const Review = require('../models/Review');
const User = require('../models/User');
const Product = require('../models/Product');
const Service = require('../models/Service');

exports.createReview = async (req, res) => {
  try {
    const { vendor, order, itemType, itemId, ratings, comment, commentAmharic } = req.body;
    
    const overallRating = (ratings.quality + ratings.reliability + ratings.service) / 3;
    
    const review = await Review.create({
      customer: req.user.id,
      vendor,
      order,
      itemType,
      itemId,
      ratings,
      overallRating,
      comment,
      commentAmharic
    });

    // Update vendor rating
    const vendorReviews = await Review.find({ vendor, isApproved: true });
    const avgRating = vendorReviews.reduce((sum, r) => sum + r.overallRating, 0) / vendorReviews.length;
    await User.findByIdAndUpdate(vendor, { 
      rating: avgRating.toFixed(2), 
      totalReviews: vendorReviews.length 
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVendorReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ vendor: req.params.vendorId, isApproved: true })
      .populate('customer', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
