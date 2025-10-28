const Volunteer = require('../models/Volunteer');

async function getAllVolunteers() {
  return await Volunteer.find().populate('user', 'name email');
}

async function getVolunteerById(id) {
  return await Volunteer.findById(id).populate('user', 'name email');
}

async function updateVolunteer(id, updateData) {
  return await Volunteer.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
}

async function deleteVolunteer(id) {
  return await Volunteer.findByIdAndDelete(id);
}

module.exports = {
  getAllVolunteers,
  getVolunteerById,
  updateVolunteer,
  deleteVolunteer,
};
