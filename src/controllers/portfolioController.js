// src/controllers/portfolioController.js
const asyncHandler = require('express-async-handler');
const Portfolio = require('../models/Portfolio');
const TalentProfile = require('../models/TalentProfile');
const fs = require('fs').promises;
const path = require('path');

const UPLOAD_DIR = path.join(__dirname, '../uploads');

// @desc    Add a new portfolio item (after upload)
// @route   POST /api/portfolio
// @access  Private
const addPortfolioItem = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user._id;

  const talent = await TalentProfile.findOne({ user: userId });
  if (!talent) {
    res.status(404);
    throw new Error('Talent profile not found');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const { filename, path: filePath, mimetype } = req.file;

  let mediaType = req.fileType; // if set by middleware
  if (!mediaType) {
    if (mimetype.startsWith('image')) mediaType = 'image';
    else if (mimetype.startsWith('video')) mediaType = 'video';
    else if (mimetype === 'application/pdf') mediaType = 'pdf';
    else {
      await fs.unlink(filePath); // cleanup
      res.status(400);
      throw new Error('Unsupported file type');
    }
  }

  const portfolioItem = await Portfolio.create({
    talent: talent._id,
    title: title || 'Untitled Work',
    description,
    mediaType,
    url: `/uploads/${filename}`,
    fileName: filename
  });

  res.status(201).json({
    success: true,
    data: portfolioItem
  });
});

// @desc    Get current user's portfolio items
// @route   GET /api/portfolio/my
// @access  Private
const getMyPortfolioItems = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const talent = await TalentProfile.findOne({ user: userId });

  if (!talent) {
    res.status(404);
    throw new Error('Talent profile not found');
  }

  const items = await Portfolio.find({ talent: talent._id }).sort({ order: 1 });
  res.json({
    success: true,
    count: items.length,
    data: items
  });
});

// @desc    Update portfolio item
// @route   PUT /api/portfolio/:id
// @access  Private
const updatePortfolioItem = asyncHandler(async (req, res) => {
  const { title, description, order } = req.body;
  const item = await Portfolio.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Portfolio item not found');
  }

  const talent = await TalentProfile.findById(item.talent).populate('user');
  if (talent.user._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  item.title = title || item.title;
  item.description = description || item.description;
  if (order !== undefined) {
    const numOrder = parseInt(order);
    if (!isNaN(numOrder)) {
      item.order = numOrder;
    }
  }

  await item.save();

  res.json({
    success: true,
    data: item
  });
});

// @desc    Delete portfolio item + file
// @route   DELETE /api/portfolio/:id
// @access  Private
const deletePortfolioItem = asyncHandler(async (req, res) => {
  const item = await Portfolio.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Portfolio item not found');
  }

  const talent = await TalentProfile.findById(item.talent).populate('user');
  if (talent.user._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const fullPath = path.join(UPLOAD_DIR, item.fileName);
  try {
    await fs.unlink(fullPath);
  } catch (err) {
    console.warn('Failed to delete file:', fullPath, err.message);
    // Don't fail the request — DB delete should still happen
  }

  await item.deleteOne();
  res.json({
    success: true,
    message: 'Portfolio item deleted'
  });
});

module.exports = {
  addPortfolioItem,
  getMyPortfolioItems,
  updatePortfolioItem,
  deletePortfolioItem
};