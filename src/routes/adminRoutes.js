const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middlewares/authMiddleware');
const { getAnalytics } = require('../controllers/adminController');

// Analytics endpoint
router.get('/analytics', protect, adminOnly, getAnalytics);

module.exports = router;
