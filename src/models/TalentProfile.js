const mongoose = require('mongoose');

const talentProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bio: {
    en: { type: String, required: true },
    fr: { type: String, default: null },
    sw: { type: String, default: null },
    rw: { type: String, default: null }  // Kinyarwanda language code 'rw'
  },
  skills: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  experienceLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'expert'],
    default: 'beginner'
  },
  availability: {
    type: String,
    enum: ['full-time', 'part-time', 'freelance'],
    default: 'part-time'
  },
  portfolio: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio'
  }]
}, { timestamps: true });

talentProfileSchema.index({ user: 1 });

module.exports = mongoose.model('TalentProfile', talentProfileSchema);
