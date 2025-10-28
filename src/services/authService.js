const User = require('../models/User');
const crypto = require('crypto');

async function createUser(data) {
  // Model validators handle role/supporterType validation
  return await User.create(data);
}

async function findUserByEmail(email, selectPassword = false) {
  return await User.findOne({ email }).select(selectPassword ? '+password' : '');
}

async function verifyPassword(user, enteredPassword) {
  return await user.matchPassword(enteredPassword);
}

async function generateResetTokenForUser(user) {
  const resetToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save({ validateBeforeSave: false });
  return resetToken;
}

async function resetUserPasswordByToken(token, password) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({ resetPasswordToken: hashedToken, resetPasswordExpires: { $gt: Date.now() } });
  if (!user) throw new Error('Invalid or expired token');
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  return await user.save();
}

module.exports = {
  createUser,
  findUserByEmail,
  verifyPassword,
  generateResetTokenForUser,
  resetUserPasswordByToken,
};
