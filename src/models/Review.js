const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  talentProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TalentProfile',
    required: true,
    index: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 1000
  }
}, { timestamps: true });

reviewSchema.index({ talentProfile: 1, reviewer: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
