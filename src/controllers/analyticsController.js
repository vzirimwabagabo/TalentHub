// src/controllers/analyticsController.js

const User = require('../models/User');
const Donation = require('../models/Donation');
const Event = require('../models/Event');
const TalentProfile = require('../models/TalentProfile');
const Opportunity = require('../models/Opportunity');

exports.getDashboardStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalDonations = await Donation.countDocuments();
        const totalEvents = await Event.countDocuments();
        const totalTalentProfiles = await TalentProfile.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalDonations,
                totalEvents,
                totalTalentProfiles
            }
        });
    } catch (error) {
        next(error);
    }
};
// Public stats for homepage
exports.getPublicStats = async (req, res, next) => {
  try {
    const totalOpportunities = await Opportunity.countDocuments({ status: 'open' });
    const totalEvents = await Event.countDocuments({ isDeleted: false });

    res.status(200).json({
      success: true,
      data: {
        totalOpportunities,
        totalEvents,
      }
    });
  } catch (error) {
    next(error);
  }
};
