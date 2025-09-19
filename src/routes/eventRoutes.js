// src/routes/eventRoutes.js

const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent
} = require('../controllers/eventController');

const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Routes
router.post('/', protect, asyncHandler(createEvent));                 // Create a new event
router.get('/', asyncHandler(getAllEvents));                          // Get all events
router.get('/:id', asyncHandler(getEventById));                       // Get a single event
router.put('/:id', protect, asyncHandler(updateEvent));               // Update an event
router.delete('/:id', protect, asyncHandler(deleteEvent));            // Delete an event

module.exports = router;
