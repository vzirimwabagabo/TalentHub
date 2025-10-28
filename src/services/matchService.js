const MatchRequest = require('../models/MatchRequest');

async function createMatchRequest(talentId, opportunity, matchScore = 0, message = '') {
  const matchRequest = new MatchRequest({ talent: talentId, opportunity, matchScore, message });
  return await matchRequest.save();
}

async function getMatchRequestsByTalent(talentId) {
  return await MatchRequest.find({ talent: talentId }).populate('opportunity');
}

async function updateMatchRequestStatus(id, status, reviewedBy) {
  return await MatchRequest.findByIdAndUpdate(id, { status, reviewedBy }, { new: true, runValidators: true });
}

async function deleteMatchRequest(id) {
  return await MatchRequest.findByIdAndDelete(id);
}

module.exports = {
  createMatchRequest,
  getMatchRequestsByTalent,
  updateMatchRequestStatus,
  deleteMatchRequest,
};
