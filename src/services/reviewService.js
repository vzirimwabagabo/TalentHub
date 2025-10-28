const Review = require('../models/Review');

async function createReview(data) {
  const review = new Review(data);
  return await review.save();
}

async function getReviewsByTalent(talentId) {
  return await Review.find({ talentProfile: talentId }).populate('reviewer', 'name email');
}

async function updateReview(id, data) {
  return await Review.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

async function deleteReview(id) {
  return await Review.findByIdAndDelete(id);
}

module.exports = {
  createReview,
  getReviewsByTalent,
  updateReview,
  deleteReview,
};
