// src/controllers/talentController.js
const TalentProfile = require('../models/TalentProfile');

// Create a new talent profile
exports.createTalentProfile = async (req, res, next) => {
  try {
    const { bio, skills, headline } = req.body;
    const userId = req.user._id;

    // Check if profile already exists
    const existingProfile = await TalentProfile.findOne({ user: userId });
    if (existingProfile) {
      return res.status(400).json({ 
        success: false, 
        message: 'Profile already exists' 
      });
    }

    const newProfile = await TalentProfile.create({
      user: userId,
      bio,
      skills,
      headline,
      isDeleted: false
    });

    res.status(201).json({
      success: true,
      message: 'Talent profile created successfully',
      data: newProfile
    });
  } catch (error) {
    next(error);
  }
};

// Get the current user's talent profile
exports.getTalentProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const profile = await TalentProfile.findOne({
      user: userId,
      isDeleted: false 
    }).populate('user', 'name email');

    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        message: 'Profile not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// Update the current user's talent profile
exports.updateTalentProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { bio, skills, headline } = req.body;

    const profile = await TalentProfile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        message: 'Profile not found' 
      });
    }

    // Only update fields that are provided
    profile.bio = bio ?? profile.bio;
    profile.skills = skills ?? profile.skills;
    profile.headline = headline ?? profile.headline;

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Talent profile updated successfully',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// Soft-delete the current user's talent profile
exports.deleteTalentProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const result = await TalentProfile.updateOne(
      { user: userId },
      { isDeleted: true }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Profile not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Talent profile deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all active talent profiles
exports.getAllTalentProfiles = async (req, res, next) => {
  try {
    const profiles = await TalentProfile.find({ isDeleted: false })
      .populate('user', 'name email role')
      .select('-createdAt -updatedAt -__v');

    res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles
    });
  } catch (error) {
    next(error);
  }
};

// Public: Get a single talent profile by ID
exports.getTalentProfileById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const profile = await TalentProfile.findById(id)
      .populate('user', 'name email')
      .select('-createdAt -updatedAt -__v');

    if (!profile || profile.isDeleted) {
      return res.status(404).json({ 
        success: false, 
        message: 'Profile not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};