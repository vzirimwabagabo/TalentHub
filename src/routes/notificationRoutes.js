// src/routes/notificationRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
    createNotification,
    getMyNotifications,
    markAsRead,
    deleteNotification
} = require('../controllers/notificationController');

router.post('/', protect, createNotification);
router.get('/me', protect, getMyNotifications);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteNotification);

module.exports = router;
