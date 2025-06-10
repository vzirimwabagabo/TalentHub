// src/routes/eventRoutes.js

const express = require('express');
const router = express.Router();

const {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent
} = require('../controllers/eventController');

const { protect, adminOnly } = require('../middlewares/authMiddleware');

// Routes
router.post('/', protect, createEvent);                 // Create a new event
router.get('/', getAllEvents);                          // Get all events
router.get('/:id', getEventById);                       // Get a single event
router.put('/:id', protect, updateEvent);               // Update an event
router.delete('/:id', protect, deleteEvent);            // Delete an event

module.exports = router;
