const matchRequestService = require('../services/matchRequestService');

exports.createMatchRequest = async (req, res, next) => {
  try {
    const { opportunity, matchScore = 0, message } = req.body;
    const talentId = req.user._id;

    const matchRequest = await matchRequestService.createMatchRequest(talentId, opportunity, matchScore, message);

    res.status(201).json({ success: true, data: matchRequest });
  } catch (error) {
    next(error);
  }
};

exports.getMatchRequestsForTalent = async (req, res, next) => {
  try {
    const talentId = req.user._id;
    const requests = await matchRequestService.getMatchRequestsByTalent(talentId);
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};

exports.updateMatchRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reviewedBy } = req.body;
    const updated = await matchRequestService.updateMatchRequestStatus(id, status, reviewedBy);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

exports.deleteMatchRequest = async (req, res, next) => {
  try {
    await matchRequestService.deleteMatchRequest(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
