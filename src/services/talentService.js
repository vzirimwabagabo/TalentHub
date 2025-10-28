const TalentProfile = require('../models/TalentProfile');

async function createTalentProfile(data) {
  const profile = new TalentProfile(data);
  return await profile.save();
}

async function getAllTalentProfiles() {
  return await TalentProfile.find().populate('user', 'name email');
}

async function getTalentProfileById(id) {
  return await TalentProfile.findById(id).populate('user', 'name email');
}

async function updateTalentProfile(id, data) {
  return await TalentProfile.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

async function deleteTalentProfile(id) {
  return await TalentProfile.findByIdAndDelete(id);
}

module.exports = {
  createTalentProfile,
  getAllTalentProfiles,
  getTalentProfileById,
  updateTalentProfile,
  deleteTalentProfile,
};
