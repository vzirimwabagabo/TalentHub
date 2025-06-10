const express = require('express');
const router = express.Router();
// Import controller functions
const { 
    createTalentProfile,
    getTalentProfile,
    updateTalentProfile,
    deleteTalentProfile,
    getAllTalentProfiles,
    getTalentProfileById,
    uploadPortfolioImage, // <-- Make sure this is imported
    deletePortfolioImage // 🔥 New line!
} = require('../controllers/talentController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
// Add a new route to delete portfolio images
router.delete('/portfolio/:imageId', protect, deletePortfolioImage);

// Add a new route to upload portfolio images
router.post('/upload', protect, upload.array('portfolioImage'), uploadPortfolioImage);

// User Routes
router.post('/', protect, createTalentProfile); // Create a new profile
router.get('/me', protect, getTalentProfile); // Get current user's profile
router.put('/me', protect, updateTalentProfile); // Update current user's profile
router.delete('/me', protect, deleteTalentProfile); // Delete current user's profile

// Admin Routes
router.get('/', protect, adminOnly, getAllTalentProfiles); // Get all talent profiles
router.get('/:id', protect, adminOnly, getTalentProfileById); // Get a single talent profile

module.exports = router;
