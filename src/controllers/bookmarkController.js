const bookmarkService = require('../services/bookmarkService');

// Create new bookmark for user
exports.createBookmark = async (req, res, next) => {
  try {
    const { itemType, itemId } = req.body;
    const userId = req.user._id; // Assumed populated from auth middleware

    const bookmark = await bookmarkService.createBookmark(userId, itemType, itemId);

    res.status(201).json({ success: true, data: bookmark });
  } catch (error) {
    next(error);
  }
};

// Get all bookmarks for current user
exports.getUserBookmarks = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const bookmarks = await bookmarkService.getUserBookmarks(userId);
    res.status(200).json({ success: true, data: bookmarks });
  } catch (error) {
    next(error);
  }
};

// Delete bookmark by ID for current user
exports.deleteBookmark = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const bookmarkId = req.params.id;

    await bookmarkService.deleteBookmark(userId, bookmarkId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
