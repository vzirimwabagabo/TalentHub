const Bookmark = require('../models/Bookmark');

async function createBookmark(userId, itemType, itemId) {
  // Check for existing bookmark first to enforce uniqueness
  const existing = await Bookmark.findOne({ user: userId, itemType, itemId });
  if (existing) throw new Error('Bookmark already exists');

  const bookmark = new Bookmark({ user: userId, itemType, itemId });

  return await bookmark.save();
}

async function getUserBookmarks(userId) {
  // Populate references if needed; adjust fields based on itemType
  return await Bookmark.find({ user: userId }).populate('itemId');
}

async function deleteBookmark(userId, bookmarkId) {
  // Ensure user owns bookmark to delete
  const result = await Bookmark.findOneAndDelete({ _id: bookmarkId, user: userId });
  if (!result) throw new Error('Bookmark not found or not authorized');
}

module.exports = {
  createBookmark,
  getUserBookmarks,
  deleteBookmark,
};
