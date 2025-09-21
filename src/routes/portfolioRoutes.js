// src/routes/portfolioRoutes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const upload = require('../middlewares/uploadMiddleware');
const { protect } = require('../middlewares/authMiddleware');
const malwareScan = require('../middlewares/malwareScan');
const {
  addPortfolioItem,
  getMyPortfolioItems,
  updatePortfolioItem,
  deletePortfolioItem
} = require('../controllers/portfolioController');

const uploadFile = upload.single('portfolioFile');

router.post('/', protect, uploadFile, malwareScan, asyncHandler(addPortfolioItem));
router.get('/my', protect, asyncHandler(getMyPortfolioItems));
router.put('/:id', protect, asyncHandler(updatePortfolioItem));
router.delete('/:id', protect, asyncHandler(deletePortfolioItem));

module.exports = router;