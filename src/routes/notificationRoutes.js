// src/routes/notificationRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const asyncHandler = require('express-async-handler');
const {
    createNotification,
    getMyNotifications,
    markAsRead,
    deleteNotification
} = require('../controllers/notificationController');

router.post('/', protect, asyncHandler(createNotification));
router.get('/me', protect, asyncHandler(getMyNotifications));
router.put('/:id/read', protect, asyncHandler(markAsRead));
router.delete('/:id', protect, asyncHandler(deleteNotification));

module.exports = router;
