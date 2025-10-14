// src/controllers/volunteerController.js
const Volunteer = require('../models/Volunteer');
const User = require('../models/User');

// Create or update volunteer profile
exports.createVolunteerProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Only supporters with supporterType 'volunteer' can create a volunteer profile
    if (req.user.role !== 'supporter' || req.user.supporterType !== 'volunteer') {
      return res.status(403).json({
        success: false,
        message: 'Only supporters with type "volunteer" can create a volunteer profile'
      });
    }

    const { bio, availability } = req.body;

    // Check if profile already exists
    const existingProfile = await Volunteer.findOne({ user: userId });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'Volunteer profile already exists'
      });
    }

    // Create profile
    const profile = await Volunteer.create({
      user: userId,
      bio,
      availability
    });

    res.status(201).json({
      success: true,
      message: 'Volunteer profile created',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// Admin: View all volunteers
exports.getAllVolunteers = async (req, res, next) => {
  try {
    // Only admin can view all volunteers
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const volunteers = await Volunteer.find()
      .populate('user', 'name email role supporterType');
    res.status(200).json({ success: true, data: volunteers });
  } catch (error) {
    next(error);
  }
};

// Admin: Approve or reject volunteer
exports.updateVolunteerStatus = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer not found' });
    }

    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    volunteer.status = status;
    await volunteer.save();

    res.status(200).json({
      success: true,
      message: `Volunteer ${status}`,
      data: volunteer
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete volunteer
exports.deleteVolunteer = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Volunteer deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get the current user's volunteer profile
exports.getVolunteerProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const profile = await Volunteer.findOne({ user: userId, isDeleted: false })
      .populate('user', 'name email');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer profile not found'
      });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

// Update the current user's volunteer profile
exports.updateVolunteerProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Only allow if user is a volunteer-type supporter
    if (req.user.role !== 'supporter' || req.user.supporterType !== 'volunteer') {
      return res.status(403).json({
        success: false,
        message: 'Only volunteer-type supporters can update this profile'
      });
    }

    const { bio, availability } = req.body;
    const profile = await Volunteer.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer profile not found'
      });
    }

    profile.bio = bio || profile.bio;
    profile.availability = availability || profile.availability;
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Volunteer profile updated successfully',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// Delete the current user's volunteer profile
exports.deleteVolunteerProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (req.user.role !== 'supporter' || req.user.supporterType !== 'volunteer') {
      return res.status(403).json({
        success: false,
        message: 'Only volunteer-type supporters can delete this profile'
      });
    }

    const profile = await Volunteer.findOneAndDelete({ user: userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer profile not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Volunteer profile deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};