const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');
const { sendResetPasswordEmail } = require('../utils/emailService');
const { sendWelcomeEmail } = require('../utils/emailSender');

// Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// ✅ Register User
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, supporterType } = req.body;

    // Validate role
    if (role && !['participant', 'supporter', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    // Prevent admin creation through regular registration
    if (role === 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin accounts can only be created through the secure admin registration endpoint' 
      });
    }

    // If role is supporter, supporterType is required
    if (role === 'supporter') {
      if (!supporterType || !['employer', 'donor', 'volunteer'].includes(supporterType)) {
        return res.status(400).json({
          success: false,
          message: 'supporterType is required and must be one of: employer, donor, volunteer'
        });
      }
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user
    const userData = { name, email, password };
    if (role) userData.role = role;
    if (supporterType) userData.supporterType = supporterType;

    const user = await User.create(userData);

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user.email, user.name).catch(console.error);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        supporterType: user.supporterType,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Login User
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        supporterType: user.supporterType
      },
      token: generateToken(user._id)
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Get User Profile
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -resetPasswordToken -resetPasswordExpires');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Forgot Password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendResetPasswordEmail(user.email, resetUrl);

    res.status(200).json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Reset Password
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token and password are required' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now log in.'
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Create Admin Account (Secure Endpoint)
exports.createAdminAccount = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Count existing admin users
    const adminCount = await User.countDocuments({ 
      role: 'admin',
      isDeleted: false
    });

    // If an admin already exists, prevent creation
    if (adminCount > 0) {
      return res.status(403).json({
        success: false,
        message: 'Admin account already exists. Only one admin is allowed in the system.'
      });
    }

    // Create admin user
    const user = await User.create({
      name,
      email,
      password,
      role: 'admin'
    });

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user.email, user.name).catch(console.error);

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Delete User (Admin or self)
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Allow self-delete or admin delete
    if (req.user._id.toString() !== id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ✅ Delete All Non-Admin Users (Admin only)
exports.deleteAllUsers = async (req, res, next) => {
  try {
    if (req.query.confirm !== 'YES_DELETE') {
      return res.status(400).json({
        success: false,
        message: 'Explicit confirmation required to delete all users.'
      });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    await User.deleteMany({ role: { $ne: 'admin' } });
    res.status(200).json({ success: true, message: 'All non-admin users deleted.' });
  } catch (error) {
    next(error);
  }
};