const eventService = require('../services/eventService');

// Create a new event
exports.createEvent = async (req, res, next) => {
  try {
    const eventData = req.body;
    const event = await eventService.createEvent(eventData);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

// Get all events
exports.getAllEvents = async (req, res, next) => {
  try {
    const events = await eventService.getAllEvents();
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    next(error);
  }
};

// Get event by ID
exports.getEventById = async (req, res, next) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

// Update event
exports.updateEvent = async (req, res, next) => {
  try {
    const updatedEvent = await eventService.updateEvent(req.params.id, req.body);
    res.status(200).json({ success: true, data: updatedEvent });
  } catch (error) {
    next(error);
  }
};

// Delete event
exports.deleteEvent = async (req, res, next) => {
  try {
    await eventService.deleteEvent(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
