// src/utils/matching.js

const Fuse = require('fuse.js');

exports.calculateMatchScore = (talentProfile, opportunity) => {
  const talentSkills = talentProfile.skills || [];
  const oppSkills = opportunity.skillsRequired || [];

  if (!talentSkills.length || !oppSkills.length) return 0.3;

  const fuse = new Fuse(oppSkills, { threshold: 0.3 });
  let totalScore = 0;
  let matches = 0;

  talentSkills.forEach(skill => {
    const result = fuse.search(skill);
    if (result.length > 0) {
      totalScore += (1 - result[0].score);
      matches++;
    }
  });

  return matches > 0 ? totalScore / talentSkills.length : 0.2;
};