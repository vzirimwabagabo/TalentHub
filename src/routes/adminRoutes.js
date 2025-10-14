// src/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const { getAnalytics } = require('../controllers/adminController');

// Analytics endpoint
router.get('/analytics', protect, adminOnly, asyncHandler(getAnalytics));

module.exports = router;
