const User = require('../models/User');

// Return all users excluding sensitive fields like password
async function getAllUsers() {
  return await User.find().select('-password -resetPasswordToken -resetPasswordExpires');
}

// Return a user by ID excluding sensitive fields
async function getUserById(userId) {
  return await User.findById(userId).select('-password -resetPasswordToken -resetPasswordExpires');
}

// Update user fields (except password)
async function updateUser(userId, updateData) {
  // Remove any attempt to update password directly here; should have separate endpoint for password update
  delete updateData.password;

  return await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
}

// Delete user by ID
async function deleteUser(userId) {
  return await User.findByIdAndDelete(userId);
}

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
