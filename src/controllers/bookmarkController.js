// src/controllers/bookmarkController.js
const Bookmark = require('../models/Bookmark');

// Create a new bookmark
exports.addBookmark = async (req, res, next) => {
    try {
        const { itemId, itemType } = req.body;
        const userId = req.user._id;

        // Check if the bookmark already exists
        const existingBookmark = await Bookmark.findOne({ user: userId, itemId, itemType });
        if (existingBookmark) {
            return res.status(400).json({
                success: false,
                message: 'Bookmark already exists'
            });
        }

        const bookmark = await Bookmark.create({
            user: userId,
            itemId,
            itemType
        });

        res.status(201).json({
            success: true,
            message: 'Bookmark added successfully',
            data: bookmark
        });
    } catch (error) {
        next(error);
    }
};

// Get all bookmarks for the logged-in user
exports.getBookmarks = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const bookmarks = await Bookmark.find({ user: userId })
            .populate('itemId')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: bookmarks
        });
    } catch (error) {
        next(error);
    }
};

// Delete a bookmark
exports.deleteBookmark = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;

        const bookmark = await Bookmark.findOneAndDelete({ _id: id, user: userId });
        if (!bookmark) {
            return res.status(404).json({
                success: false,
                message: 'Bookmark not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Bookmark deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
