// src/services/adminService.js

const User = require('../models/User');
const Donation = require('../models/Donation');
const TalentProfile = require('../models/TalentProfile');
const Volunteer = require('../models/Volunteer');
const Message = require('../models/Message');

// Return total user count
async function getUserCount() {
  return await User.countDocuments();
}

// Return total sum of donations
async function getTotalDonationsAmount() {
  const result = await Donation.aggregate([
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  return result[0]?.total || 0;
}

// Return 5 most recently updated talents with user info
async function getMostActiveTalents() {
  return await TalentProfile.find()
    .sort({ updatedAt: -1 })
    .limit(5)
    .populate('user', 'name email');
}

// Return 5 most recently updated volunteers with user info
async function getMostActiveVolunteers() {
  return await Volunteer.find()
    .sort({ updatedAt: -1 })
    .limit(5)
    .populate('user', 'name email');
}

// Return count of unread messages
async function getUnreadMessagesCount() {
  return await Message.countDocuments({ read: false });
}

module.exports = {
  getUserCount,
  getTotalDonationsAmount,
  getMostActiveTalents,
  getMostActiveVolunteers,
  getUnreadMessagesCount,
};
