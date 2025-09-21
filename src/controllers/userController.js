const User = require('../models/User');

// Get all users (admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password -resetPasswordToken -resetPasswordExpires');
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

// Get a user by ID (public profile)
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password -resetPasswordToken -resetPasswordExpires');
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// Update own profile
exports.updateUserProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true })
      .select('-password -resetPasswordToken -resetPasswordExpires');
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};