// src/models/Volunteer.js

const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bio: {
    type: String,
    required: [true, 'Bio is required'],
    trim: true,
    minlength: [10, 'Bio must be at least 10 characters'],
    maxlength: [500, 'Bio must be at most 500 characters']
  },
  availability: {
    type: String,
    required: [true, 'Availability is required'],
    enum: {
      values: ['Weekdays', 'Weekends', 'Anytime'],
      message: 'Availability must be either Weekdays, Weekends, or Anytime'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  isDeleted: {
  type: Boolean,
  default: false
}

}, {
  timestamps: true
});

module.exports = mongoose.model('Volunteer', volunteerSchema);
