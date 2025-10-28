const auditLogService = require('../services/auditLogService');

exports.getAuditLogsByUser = async (req, res, next) => {
  try {
    const logs = await auditLogService.getAuditLogsByUser(req.params.userId);
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};
