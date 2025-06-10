// src/controllers/eventController.js

const Event = require('../models/Event');

// Create a new event
exports.createEvent = async (req, res, next) => {
    try {
        const { title, description, date, location } = req.body;
        const createdBy = req.user._id;

        const event = await Event.create({
            title,
            description,
            date,
            location,
            image,
            createdBy
        });

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: event
        });
    } catch (error) {
        next(error);
    }
};

// Get all events
exports.getAllEvents = async (req, res, next) => {
    try {
        const events = await Event.find({isDeleted: false}).populate('createdBy', 'name email');
        res.status(200).json({
            success: true,
            data: events
        });
    } catch (error) {
        next(error);
    }
};

// Get a single event by ID
exports.getEventById = async (req, res, next) => {
    try {
        const event = await Event.findById({_id: req.params.id, isDeleted: false}).populate('createdBy', 'name email');
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        next(error);
    }
};
// Update an event by ID
exports.updateEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        // Only allow the creator or an admin to update
        if (!event.createdBy.equals(req.user._id) && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const { title, description, date, location } = req.body;
        event.title = title || event.title;
        event.description = description || event.description;
        event.date = date || event.date;
        event.location = location || event.location;

        await event.save();

        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            data: event
        });
    } catch (error) {
        next(error);
    }
};

// Delete an event by ID
exports.deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        // Only allow the creator or an admin to delete
        if (!event.createdBy.equals(req.user._id) && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        event.isDeleted = true; // Soft delete
        await event.save();

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
