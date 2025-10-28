const Event = require('../models/Event');

async function createEvent(eventData) {
  const event = new Event(eventData);
  return await event.save();
}

async function getAllEvents() {
  return await Event.find().sort({ startDate: -1 });
}

async function getEventById(id) {
  return await Event.findById(id);
}

async function updateEvent(id, updateData) {
  return await Event.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
}

async function deleteEvent(id) {
  return await Event.findByIdAndDelete(id);
}

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
