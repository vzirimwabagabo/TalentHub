const User = require('../models/User');
const Donation = require('../models/Donation');
const TalentProfile = require('../models/TalentProfile');
const Volunteer = require('../models/Volunteer');
const Message = require('../models/Message');

// Get analytics data
exports.getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDonationsAggregate = await Donation.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalDonations = totalDonationsAggregate[0]?.total || 0;

    const mostActiveTalents = await TalentProfile.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('user', 'name email');

    const mostActiveVolunteers = await Volunteer.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('user', 'name email');

    const unreadMessages = await Message.countDocuments({ read: false });

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
