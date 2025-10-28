const AuditLog = require('../models/AuditLog');

async function getAuditLogsByUser(userId) {
  return await AuditLog.find({ user: userId }).sort({ createdAt: -1 });
}

module.exports = {
  getAuditLogsByUser,
};
