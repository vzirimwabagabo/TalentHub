const express = require('express');
const router = express.Router();
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

// User: Create volunteer profile
router.post('/', protect, createVolunteerProfile);
router.get('/me', protect, getVolunteerProfile);
router.put('/me', protect, updateVolunteerProfile);
router.delete('/me', protect, deleteVolunteerProfile);

// Admin: Manage all volunteers
router.get('/', protect, adminOnly, getAllVolunteers);
router.put('/:id/status', protect, adminOnly, updateVolunteerStatus);
router.delete('/:id', protect, adminOnly, deleteVolunteer);

module.exports = router;
