const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: {
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
  category: {
    type: String,
    enum: ['job', 'internship', 'scholarship', 'grant', 'volunteering', 'other'],
    required: true
  },
  location: {
    type: String,
    trim: true,
    maxlength: 200,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applyUrl: {
    type: String,
    trim: true,
    default: null
  },
  deadline: {
    type: Date,
    required: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

opportunitySchema.index({ category: 1, isActive: 1, deadline: 1 });

module.exports = mongoose.model('Opportunity', opportunitySchema);
