// src/middlewares/roleMiddleware.js
exports.supporterOnly = (req, res, next) => {
  if (req.user?.role === 'supporter') return next();
  return res.status(403).json({ success: false, message: 'Supporters only' });
};

exports.participantOnly = (req, res, next) => {
  if (req.user?.role === 'participant') return next();
  return res.status(403).json({ success: false, message: 'Available to refugees/talents only' });
};