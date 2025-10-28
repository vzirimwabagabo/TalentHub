const opportunityService = require('../services/opportunityService');

exports.createOpportunity = async (req, res, next) => {
  try {
    const opportunity = await opportunityService.createOpportunity(req.body);
    res.status(201).json({ success: true, data: opportunity });
  } catch (error) {
    next(error);
  }
};

exports.getAllOpportunities = async (req, res, next) => {
  try {
    const opportunities = await opportunityService.getAllOpportunities();
    res.status(200).json({ success: true, data: opportunities });
  } catch (error) {
    next(error);
  }
};

exports.getOpportunityById = async (req, res, next) => {
  try {
    const opportunity = await opportunityService.getOpportunityById(req.params.id);
    if (!opportunity) return res.status(404).json({ success: false, message: 'Opportunity not found' });
    res.status(200).json({ success: true, data: opportunity });
  } catch (error) {
    next(error);
  }
};

exports.updateOpportunity = async (req, res, next) => {
  try {
    const updatedOpportunity = await opportunityService.updateOpportunity(req.params.id, req.body);
    res.status(200).json({ success: true, data: updatedOpportunity });
  } catch (error) {
    next(error);
  }
};

exports.deleteOpportunity = async (req, res, next) => {
  try {
    await opportunityService.deleteOpportunity(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
