// src/models/Portifolio.js
const mongoose = require('mongoose');

const portifolioSchema = new mongoose.Schema({
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
    enum: ['image', 'video', 'pdf'],
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
  
  title: { type: String, required: true },
  description: { type: String },
  mediaType: { 
    type: String, 
    enum: ['image', 'video', 'pdf', 'audio'], 
    required: true 
  },
  projectType: { 
    type: String,
    enum: ['Art', 'Music', 'Writing', 'Design', 'Video', 'Craft', 'Education']
  }, // ← Helps categorize
  tags: [String], // e.g., ["refugee story", "women empowerment"]
  isFeatured: { type: Boolean, default: false }
}, 
{ timestamps: true });

module.exports = mongoose.model('Portifolio', portifolioSchema);