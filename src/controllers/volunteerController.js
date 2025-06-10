const Volunteer = require('../models/Volunteer');

// Create or update volunteer profile
exports.createVolunteerProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { bio, availability } = req.body;

    // Check if profile already exists
    const existingProfile = await Volunteer.findOne({ user: userId });
    if (existingProfile) {
      return res.status(400).json({ success: false, message: 'Volunteer profile already exists' });
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
        const volunteers = await Volunteer.find().populate('user', 'name email role');
        res.status(200).json({ success: true, data: volunteers });
    } catch (error) {
        next(error);
    }
};

// Admin: Approve or reject volunteer
exports.updateVolunteerStatus = async (req, res, next) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id);
        if (!volunteer) {
            return res.status(404).json({ success: false, message: 'Volunteer not found' });
        }
        volunteer.status = req.body.status;
        await volunteer.save();
        res.status(200).json({ success: true, message: `Volunteer ${volunteer.status}`, data: volunteer });
    } catch (error) {
        next(error);
    }
};

// Admin: Delete volunteer
exports.deleteVolunteer = async (req, res, next) => {
    try {
        const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
        if (!volunteer) {
            return res.status(404).json({ success: false, message: 'Volunteer not found' });
        }
        res.status(200).json({ success: true, message: 'Volunteer deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Get the current user's volunteer profile
exports.getVolunteerProfile = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const profile = await Volunteer.findOne({ user: userId,isDeleted: false }).populate('user', 'name email');
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Volunteer profile not found' });
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
        const { bio, availability } = req.body;

        const profile = await Volunteer.findOne({ user: userId });
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Volunteer profile not found' });
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
        const profile = await Volunteer.findOneAndDelete({ user: userId });
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Volunteer profile not found' });
        }

        res.status(200).json({ success: true, message: 'Volunteer profile deleted successfully' });
    } catch (error) {
        next(error);
    }
};
