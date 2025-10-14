// src/controllers/matchController.js
const asyncHandler = require('express-async-handler');
const Opportunity = require('../models/Opportunity');
const MatchRequest = require('../models/MatchRequest');
const TalentProfile = require('../models/TalentProfile');
const { sendMatchNotification } = require('../utils/emailService');
const { calculateMatchScore } = require('../utils/matching');

// @desc    Submit a match request (by participant)
// @route   POST /api/v1/matches
// @access  Private (participant only)
const submitMatchRequest = asyncHandler(async (req, res) => {
  const { opportunityId, message } = req.body;
  const talentId = req.user._id;

  // Validate user role
  if (req.user.role !== 'participant') {
    res.status(403);
    throw new Error('Only refugees/talents can submit match requests');
  }

  // Ensure opportunity exists and is open
  const opportunity = await Opportunity.findById(opportunityId);
  if (!opportunity) {
    res.status(404);
    throw new Error('Opportunity not found');
  }
  if (opportunity.status !== 'open') {
    res.status(400);
    throw new Error('This opportunity is no longer available');
  }

  // Prevent duplicate requests
  const existingRequest = await MatchRequest.findOne({
    talent: talentId,
    opportunity: opportunityId,
    status: { $in: ['pending', 'approved'] }
  });
  if (existingRequest) {
    res.status(400);
    throw new Error('You have already requested this opportunity');
  }

  // Fetch talent profile for matching
  const talentProfile = await TalentProfile.findOne({ user: talentId });
  if (!talentProfile) {
    res.status(400);
    throw new Error('Please complete your talent profile before applying');
  }

  // Calculate match score
  const matchScore = calculateMatchScore(talentProfile, opportunity);

  // Create match request
  const request = await MatchRequest.create({
    talent: talentId,
    opportunity: opportunityId,
    matchScore,
    message: message || '',
    status: 'pending'
  });

  res.status(201).json({
    success: true,
    message: 'Match request submitted successfully',
    data: request
  });
});

// @desc    Get all match requests for current user
// @route   GET /api/v1/matches/my
// @access  Private
const getUserMatchRequests = asyncHandler(async (req, res) => {
  const requests = await MatchRequest.find({ talent: req.user._id })
    .populate('opportunity', 'title type location description')
    .populate('talent', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: requests.length,
    data: requests
  });
});

// @desc    Admin/Supporter: Review (approve/reject) a match request
// @route   PATCH /api/v1/matches/:id/review
// @access  Private (admin or supporter who posted the opportunity)
const reviewMatchRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' or 'rejected'

  if (!['approved', 'rejected'].includes(status)) {
    res.status(400);
    throw new Error('Status must be "approved" or "rejected"');
  }

  const request = await MatchRequest.findById(id)
    .populate('talent', 'name email')
    .populate('opportunity');

  if (!request) {
    res.status(404);
    throw new Error('Match request not found');
  }

  // Only admin or the opportunity's poster can review
  if (
    req.user.role !== 'admin' &&
    !request.opportunity.postedBy.equals(req.user._id)
  ) {
    res.status(403);
    throw new Error('You are not authorized to review this request');
  }

  // Update request
  request.status = status;
  request.reviewedBy = req.user._id;
  await request.save();

  // Update opportunity status
  if (status === 'approved') {
    await Opportunity.findByIdAndUpdate(request.opportunity._id, {
      status: 'claimed',
      claimedBy: request.talent._id
    });
  }

  // Send email notification
  await sendMatchNotification(
    request.talent.email,
    request.talent.name,
    status,
    request.opportunity.title
  );

  res.status(200).json({
    success: true,
    message: `Request ${status}`,
    data: request
  });
});

// @desc    Admin: Get all match requests (for dashboard)
// @route   GET /api/v1/matches
// @access  Private (admin only)
const getAllMatchRequests = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Access denied');
  }

  const requests = await MatchRequest.find()
    .populate('talent', 'name email')
    .populate('opportunity', 'title type')
    .populate('reviewedBy', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: requests.length,
    data: requests
  });
});

module.exports = {
  submitMatchRequest,
  getUserMatchRequests,
  reviewMatchRequest,
  getAllMatchRequests
};