const Donation = require('../models/Donation');

// Creates a donation record
async function createDonation(donor, amount, currency = 'USD', message = '') {
  // Additional validation can be here if needed
  const donation = new Donation({ donor, amount, currency, message });
  return await donation.save();
}

// Retrieves all donations sorted by date desc
async function getAllDonations() {
  return await Donation.find().sort({ date: -1 });
}

module.exports = {
  createDonation,
  getAllDonations,
};
