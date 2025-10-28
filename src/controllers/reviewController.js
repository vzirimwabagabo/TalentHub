const reviewService = require('../services/reviewService');

exports.createReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview(req.body);
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

exports.getReviewsByTalent = async (req, res, next) => {
  try {
    const reviews = await reviewService.getReviewsByTalent(req.params.talentId);
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const updatedReview = await reviewService.updateReview(req.params.id, req.body);
    res.status(200).json({ success: true, data: updatedReview });
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    await reviewService.deleteReview(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
