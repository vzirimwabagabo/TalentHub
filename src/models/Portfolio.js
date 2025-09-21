// src/models/Portfolio.js
const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  talent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TalentProfile',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: 1000
  },
  mediaType: {
    type: String,
    enum: ['image', 'video', 'pdf', 'audio'], // ← Added 'audio' from your second def
    required: true
  },
  url: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  projectType: { 
    type: String,
    enum: ['Art', 'Music', 'Writing', 'Design', 'Video', 'Craft', 'Education']
  },
  tags: [String],
  isFeatured: { 
    type: Boolean, 
    default: false 
  }
}, 
{ timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);