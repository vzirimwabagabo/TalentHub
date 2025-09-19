// src/routes/talentRoutes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

// Import controller functions
const {
    createTalentProfile,
    getTalentProfile,
    updateTalentProfile,
    deleteTalentProfile,
    getAllTalentProfiles,
    getTalentProfileById
} = require('../controllers/talentController');

const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Create a new talent profile (logged-in user only)
router.post('/', protect, asyncHandler(createTalentProfile));

// Get current user's own talent profile
router.get('/me', protect, asyncHandler(getTalentProfile));

// Update current user's talent profile
router.put('/me', protect, asyncHandler(updateTalentProfile));

// Delete current user's talent profile
router.delete('/me', protect, asyncHandler(deleteTalentProfile));


// Get all talent profiles (public)
router.get('/', asyncHandler(getAllTalentProfiles));

// Get a single talent profile by ID (public)
router.get('/:id', asyncHandler(getTalentProfileById));

// [Optional] Delete any talent profile (admin only)
router.delete('/:id', protect, adminOnly, asyncHandler(deleteTalentProfile));


module.exports = router;