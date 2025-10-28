const talentService = require('../services/talentService');

exports.createTalentProfile = async (req, res, next) => {
  try {
    const profile = await talentService.createTalentProfile(req.body);
    res.status(201).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

exports.getAllTalentProfiles = async (req, res, next) => {
  try {
    const profiles = await talentService.getAllTalentProfiles();
    res.status(200).json({ success: true, data: profiles });
  } catch (error) {
    next(error);
  }
};

exports.getTalentProfileById = async (req, res, next) => {
  try {
    const profile = await talentService.getTalentProfileById(req.params.id);
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

exports.updateTalentProfile = async (req, res, next) => {
  try {
    const updated = await talentService.updateTalentProfile(req.params.id, req.body);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

exports.deleteTalentProfile = async (req, res, next) => {
  try {
    await talentService.deleteTalentProfile(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
