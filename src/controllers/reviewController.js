// src/controllers/reviewController.js

const Review = require('../models/Review');

// Create a new review
exports.createReview = async (req, res, next) => {
    try {
        const { content, rating } = req.body;
        const userId = req.user._id;

        const review = await Review.create({
            user: userId,
            content,
            rating
        });

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            data: review
        });
    } catch (error) {
        next(error);
    }
};

// Get user's reviews
exports.getUserReviews = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const reviews = await Review.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: reviews
        });
    } catch (error) {
        next(error);
    }
};

// Admin: Get all reviews
exports.getAllReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find().populate('user', 'name email');
        res.status(200).json({
            success: true,
            data: reviews
        });
    } catch (error) {
        next(error);
    }
};

// Delete a review
exports.deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        // Only allow the review owner or an admin to delete
        if (!review.user.equals(req.user._id) && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        await review.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
