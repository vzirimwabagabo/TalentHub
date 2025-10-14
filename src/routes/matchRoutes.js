// src/routes/matchRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { submitMatchRequest, reviewMatchRequest, getUserMatchRequests } = require('../controllers/matchController');

router.post('/', protect, submitMatchRequest);
router.get('/my', protect, getUserMatchRequests);
router.patch('/:id/review', protect, reviewMatchRequest); // Admin/supporter approves

module.exports = router;