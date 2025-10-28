// src/routes/analyticsRoutes.js

const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const { getDashboardStats, getPublicStats } = require('../controllers/analyticsController');

// Admin-only dashboard
router.get('/dashboard', protect, adminOnly, asyncHandler(getDashboardStats));
// Public stats
router.get('/public', asyncHandler(getPublicStats)); 

module.exports = router;
