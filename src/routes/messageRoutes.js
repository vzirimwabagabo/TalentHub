const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
    sendMessage,
    getUserMessages,
    getUnreadMessages,
    markAsRead,
    deleteMessage
} = require('../controllers/messageController');

router.post('/', protect, sendMessage);
router.get('/', protect, getUserMessages);
router.get('/unread', protect, getUnreadMessages);
router.patch('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteMessage);

module.exports = router;

