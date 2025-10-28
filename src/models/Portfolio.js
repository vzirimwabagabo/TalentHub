const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  talentProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TalentProfile',
    required: true,
    index: true
  },
  projectName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150
  },
  description: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  projectUrl: {
    type: String,
    trim: true,
    default: null
  },
  technologies: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  startDate: {
    type: Date,
    required: false
  },
  endDate: {
    type: Date,
    required: false,
    validate: {
      validator: function(value) {
        return !value || value >= this.startDate;
      },
      message: 'End date must be after start date'
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
