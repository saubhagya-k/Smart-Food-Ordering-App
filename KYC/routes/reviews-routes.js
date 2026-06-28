const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const authMiddleware = require('../middleware/auth');

// POST - Submit a review
router.post('/reviews', authMiddleware, async (req, res) => {
  try {
    // Debug - log what's in req.user
    console.log('req.user:', req.user);
    
    // Get user from JWT token
    const userId = req.user.id;
    const username = req.user.username || req.user.name || 'Anonymous';
    
    // Get rating and reviewText from frontend
    const { rating, reviewText } = req.body;
    
    console.log('Received:', { userId, username, rating, reviewText });
    
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
      reviewText: reviewText || ''
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

module.exports = router;