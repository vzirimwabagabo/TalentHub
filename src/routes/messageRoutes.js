// src/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const asyncHandler = require('express-async-handler');
const {
    sendMessage,
    getUserMessages,
    getUnreadMessages,
    markAsRead,
    deleteMessage
} = require('../controllers/messageController');

router.post('/', protect, asyncHandler(sendMessage));        
router.get('/', protect, asyncHandler(getUserMessages));
router.get('/unread', protect, asyncHandler(getUnreadMessages));
router.patch('/:id/read', protect, asyncHandler(markAsRead));
router.delete('/:id', protect, asyncHandler(deleteMessage));

module.exports = router;

