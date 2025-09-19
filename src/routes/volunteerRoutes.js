const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const {
    createVolunteerProfile,
    getAllVolunteers,
    updateVolunteerStatus,
    deleteVolunteer,
    getVolunteerProfile,
    updateVolunteerProfile,
    deleteVolunteerProfile
} = require('../controllers/volunteerController');

// User: Create & manage own volunteer profile
router.post('/', protect, asyncHandler(createVolunteerProfile));
router.get('/me', protect, asyncHandler(getVolunteerProfile));
router.put('/me', protect, asyncHandler(updateVolunteerProfile));
router.delete('/me', protect, asyncHandler(deleteVolunteerProfile));

// Admin: Manage all volunteers
router.get('/', protect, adminOnly, asyncHandler(getAllVolunteers));
router.put('/:id/status', protect, adminOnly, asyncHandler(updateVolunteerStatus));
router.delete('/:id', protect, adminOnly, asyncHandler(deleteVolunteer));

module.exports = router;