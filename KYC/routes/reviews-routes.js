const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const authMiddleware = require('../middleware/auth');

// POST - Submit a review
router.post('/reviews', authMiddleware, async (req, res) => {
  try {
    // Get user from JWT token
    const userId = req.user.id;
    const username = req.user.username || req.user.name || 'Anonymous';
    
    // Get rating and reviewText from frontend
    const { rating, reviewText, restaurantId } = req.body;
    
    // Validation
    if (!rating) {
      return res.status(400).json({ error: 'Rating is required' });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    // Create new review
    const review = new Review({
      userId: userId,
      username: username,
      rating: rating,
      reviewText: reviewText || '',
      ...(restaurantId && { restaurantId: String(restaurantId) })
    });
    
    await review.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Review submitted successfully',
      review: review
    });
    
  } catch (error) {
    console.error('Review error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET - Get all reviews (public)
router.get('/reviews', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const reviews = await Review.find({})
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    
    const avgRating = await Review.aggregate([
      { $group: { _id: null, average: { $avg: '$rating' } } }
    ]);
    
    res.json({
      success: true,
      average: avgRating[0]?.average || 0,
      total: reviews.length,
      reviews: reviews
    });
    
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// GET - Get reviews for one restaurant (public)
router.get('/reviews/restaurant/:restaurantId', async (req, res) => {
  try {
    const restaurantId = String(req.params.restaurantId);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    const reviews = await Review.find({ restaurantId })
      .sort({ createdAt: -1 })
      .limit(limit);

    const avgRating = await Review.aggregate([
      { $match: { restaurantId } },
      { $group: { _id: null, average: { $avg: '$rating' } } }
    ]);

    res.json({
      success: true,
      average: avgRating[0]?.average || 0,
      total: reviews.length,
      reviews: reviews
    });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

module.exports = router;