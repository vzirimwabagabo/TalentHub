const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const {
    createDonation,
    getAllDonations,
    getUserDonations,
    getDonationById,
    deleteDonation
} = require('../controllers/donationController');

// User Routes
router.post('/', protect, createDonation);               // Create donation
router.get('/me', protect, getUserDonations);            // Get current user's donations

// Admin Routes
router.get('/', protect, adminOnly, getAllDonations);    // Get all donations
router.get('/:id', protect, adminOnly, getDonationById); // Get single donation
router.delete('/:id', protect, adminOnly, deleteDonation); // Delete donation

module.exports = router;
