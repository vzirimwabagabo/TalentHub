// src/routes/analyticsRoutes.js

const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const { getDashboardStats } = require('../controllers/analyticsController');

// Admin-only dashboard
router.get('/dashboard', protect, adminOnly, getDashboardStats);

module.exports = router;
