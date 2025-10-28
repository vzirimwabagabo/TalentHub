// src/controllers/adminController.js

const {
  getUserCount,
  getTotalDonationsAmount,
  getMostActiveTalents,
  getMostActiveVolunteers,
  getUnreadMessagesCount
} = require('../services/adminService');

// Get analytics data for admin dashboard
exports.getAnalytics = async (req, res, next) => {
  try {
    // Call service layer functions to fetch data
    const totalUsers = await getUserCount();
    const totalDonations = await getTotalDonationsAmount();
    const mostActiveTalents = await getMostActiveTalents();
    const mostActiveVolunteers = await getMostActiveVolunteers();
    const unreadMessages = await getUnreadMessagesCount();

    // Send aggregated response
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalDonations,
        mostActiveTalents,
        mostActiveVolunteers,
        unreadMessages
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all users (without sensitive fields)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await require('../models/User')
      .find()
      .select('-password -resetPasswordToken -resetPasswordExpires');
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};
