// src/models/TalentProfile.js
const mongoose = require('mongoose');

const talentProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bio: {
    en: {
      type: String,
      required: [true, 'English bio is required'],
      trim: true
    },
    fr: {
      type: String,
      trim: true
    },
    sw: {
      type: String,
      trim: true
    },
    rw: {
      type: String,
      trim: true
    }
  },
  headline: {
    en: {
      type: String,
      trim: true,
      maxlength: 100
    },
    fr: {
      type: String,
      trim: true,
      maxlength: 100
    },
    sw: {
      type: String,
      trim: true,
      maxlength: 100
    },
    rw: {
      type: String,
      trim: true,
      maxlength: 100
    }
  },
  skills: [{
    type: String,
    trim: true
  }],
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TalentProfile', talentProfileSchema);