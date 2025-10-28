const Opportunity = require('../models/Opportunity');

async function createOpportunity(data) {
  const opportunity = new Opportunity(data);
  return await opportunity.save();
}

async function getAllOpportunities() {
  return await Opportunity.find().sort({ createdAt: -1 });
}

async function getOpportunityById(id) {
  return await Opportunity.findById(id);
}

async function updateOpportunity(id, data) {
  return await Opportunity.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

async function deleteOpportunity(id) {
  return await Opportunity.findByIdAndDelete(id);
}

module.exports = {
  createOpportunity,
  getAllOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
};
