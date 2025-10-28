const volunteerService = require('../services/volunteerService');

// Get all volunteers
exports.getAllVolunteers = async (req, res, next) => {
  try {
    const volunteers = await volunteerService.getAllVolunteers();
    res.status(200).json({ success: true, data: volunteers });
  } catch (error) {
    next(error);
  }
};

// Get volunteer by ID
exports.getVolunteerById = async (req, res, next) => {
  try {
    const volunteer = await volunteerService.getVolunteerById(req.params.id);
    if (!volunteer) return res.status(404).json({ success: false, message: 'Volunteer not found' });
    res.status(200).json({ success: true, data: volunteer });
  } catch (error) {
    next(error);
  }
};

// Update volunteer profile
exports.updateVolunteer = async (req, res, next) => {
  try {
    const updatedVolunteer = await volunteerService.updateVolunteer(req.params.id, req.body);
    res.status(200).json({ success: true, data: updatedVolunteer });
  } catch (error) {
    next(error);
  }
};

// Delete volunteer
exports.deleteVolunteer = async (req, res, next) => {
  try {
    await volunteerService.deleteVolunteer(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
