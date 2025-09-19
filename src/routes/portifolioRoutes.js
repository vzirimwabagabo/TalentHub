// src/routes/portifolioRoutes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const upload = require('../middlewares/uploadMiddleware');
const { protect } = require('../middlewares/authMiddleware');
const {
  addPortifolioItem,
  getMyPortifolioItems,
  updatePortifolioItem,
  deletePortifolioItem
} = require('../controllers/portifolioController');

const uploadFile = upload.single('portfolioFile');

router.post('/', protect, uploadFile, asyncHandler(addPortifolioItem));
router.get('/my', protect, asyncHandler(getMyPortifolioItems));
router.put('/:id', protect, asyncHandler(updatePortifolioItem));
router.delete('/:id', protect, asyncHandler(deletePortifolioItem));

module.exports = router;