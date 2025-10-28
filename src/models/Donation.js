const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01  // validate minimum donation amount
  },
  currency: {
    type: String,
    default: 'USD',  // or add support for multiple currencies if needed
    uppercase: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  message: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
