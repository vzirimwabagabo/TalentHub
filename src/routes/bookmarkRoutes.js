const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
    addBookmark,
    getBookmarks,
    deleteBookmark
} = require('../controllers/bookmarkController');

// Add a new bookmark
router.post('/', protect, addBookmark);

// Get all bookmarks for the logged-in user
router.get('/', protect, getBookmarks);

// Delete a bookmark by ID
router.delete('/:id', protect, deleteBookmark);

module.exports = router;
