const asyncHandler = require('express-async-handler');
const Portifolio = require('../models/Portifolio');
const TalentProfile = require('../models/TalentProfile');
const fs = require('fs');
const path = require('path');

// @desc    Add a new portifolio item (after upload)
// @route   POST /api/portifolio
// @access  Private
const addPortifolioItem = asyncHandler(async (req, res) => {
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

  const mediaType = req.fileType;
  if (mimetype.startsWith('image')) mediaType = 'image';
  else if (mimetype.startsWith('video')) mediaType = 'video';
  else if (mimetype === 'application/pdf') mediaType = 'pdf';
  else {
    fs.unlinkSync(filePath);
    res.status(400);
    throw new Error('Unsupported file type');
  }

  const portifolioItem = await Portifolio.create({
    talent: talent._id,
    title: title || 'Untitled Work',
    description,
    mediaType,
    url: `/uploads/${filename}`,
    fileName: filename
  });

  res.status(201).json({
    success: true,
    data: portifolioItem
  });
});

// @desc    Get current user's portifolio items
// @route   GET /api/portifolio/my
// @access  Private
const getMyPortifolioItems = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const talent = await TalentProfile.findOne({ user: userId });

  if (!talent) {
    res.status(404);
    throw new Error('Talent profile not found');
  }

  const items = await Portifolio.find({ talent: talent._id }).sort({ order: 1 });
  res.json({
    success: true,
    count: items.length,
    data: items
  });
});

// @desc    Update portifolio item
// @route   PUT /api/portifolio/:id
// @access  Private
const updatePortifolioItem = asyncHandler(async (req, res) => {
  const { title, description, order } = req.body;
  const item = await Portifolio.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Portifolio item not found');
  }

  const talent = await TalentProfile.findById(item.talent).populate('user');
  if (talent.user._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  item.title = title || item.title;
  item.description = description || item.description;
  if (order !== undefined) item.order = order;

  await item.save();

  res.json({
    success: true,
    data: item
  });
});

// @desc    Delete portifolio item + file
// @route   DELETE /api/portifolio/:id
// @access  Private
const deletePortifolioItem = asyncHandler(async (req, res) => {
  const item = await Portifolio.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Portifolio item not found');
  }

  const talent = await TalentProfile.findById(item.talent).populate('user');
  if (talent.user._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const fullPath = path.join(__dirname, '..', item.url);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }

  await item.deleteOne();
  res.json({
    success: true,
    message: 'Portifolio item deleted'
  });
});

module.exports = {
  addPortifolioItem,
  getMyPortifolioItems,
  updatePortifolioItem,
  deletePortifolioItem
};