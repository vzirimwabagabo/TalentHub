// src/routes/reviewRoutes.js

const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const {
    createReview,
    getUserReviews,
    getAllReviews,
    deleteReview
} = require('../controllers/reviewController');

// Routes
router.post('/', protect, createReview); // Create a new review
router.get('/me', protect, getUserReviews); // Get user's own reviews
router.get('/', protect, adminOnly, getAllReviews); // Admin: Get all reviews
router.delete('/:id', protect, deleteReview); // Delete a review

module.exports = router;
