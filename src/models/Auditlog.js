// src/models/Auditlog.js
const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: { type: String },
  details: { type: Object },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('AuditLog', auditLogSchema);