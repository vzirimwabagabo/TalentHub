// src/routes/bookmarkRoutes.js

const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect } = require('../middlewares/authMiddleware');
const {
    addBookmark,
    getBookmarks,
    deleteBookmark
} = require('../controllers/bookmarkController');

// Add a new bookmark
router.post('/', protect, asyncHandler(addBookmark));

// Get all bookmarks for the logged-in user
router.get('/', protect, asyncHandler(getBookmarks));

// Delete a bookmark by ID
router.delete('/:id', protect, asyncHandler(deleteBookmark));

module.exports = router;
