const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const {
    createDonation,
    getAllDonations,
    getUserDonations,
    getDonationById,
    deleteDonation
} = require('../controllers/donationController');

// User Routes
router.post('/', protect, asyncHandler(createDonation));               // Create donation
router.get('/me', protect, asyncHandler(getUserDonations));            // Get current user's donations

// Admin Routes
router.get('/', protect, adminOnly, asyncHandler(getAllDonations));    // Get all donations
router.get('/:id', protect, adminOnly, asyncHandler(getDonationById)); // Get single donation
router.delete('/:id', protect, adminOnly, asyncHandler(deleteDonation)); // Delete donation by ID

module.exports = router;
