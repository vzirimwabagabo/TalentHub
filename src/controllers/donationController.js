const donationService = require('../services/donationService');

// Create a new donation
exports.createDonation = async (req, res, next) => {
  try {
    const { amount, currency, message } = req.body;
    const donor = req.user._id;

    const donation = await donationService.createDonation(donor, amount, currency, message);
    res.status(201).json({ success: true, data: donation });
  } catch (error) {
    next(error);
  }
};

// List all donations (admin or authorized users only)
exports.getAllDonations = async (req, res, next) => {
  try {
    // Authorization check can be done here or middleware
    const donations = await donationService.getAllDonations();
    res.status(200).json({ success: true, data: donations });
  } catch (error) {
    next(error);
  }
};
