// src/routes/reviewRoutes.js

const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const {
    createReview,
    getUserReviews,
    getAllReviews,
    deleteReview
} = require('../controllers/reviewController');

// Routes
router.post('/', protect, asyncHandler(createReview)); // Create a new review
router.get('/me', protect, asyncHandler(getUserReviews)); // Get user's own reviews
router.get('/', protect, adminOnly, asyncHandler(getAllReviews)); // Admin: Get all reviews
router.delete('/:id', protect, asyncHandler(deleteReview)); // Delete a review

module.exports = router;
