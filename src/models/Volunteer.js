const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  bio: {
    en: { type: String, required: true },
    fr: { type: String, default: null },
    sw: { type: String, default: null },
    rw: { type: String, default: null }  // Kinyarwanda support
  },
  skills: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  availability: {
    type: String,
    enum: ['full-time', 'part-time', 'seasonal', 'occasional'],
    default: 'part-time',
  },
  interests: [{
    type: String,
    trim: true,
    maxlength: 100,
  }],
}, { timestamps: true });

volunteerSchema.index({ user: 1 });

module.exports = mongoose.model('Volunteer', volunteerSchema);
