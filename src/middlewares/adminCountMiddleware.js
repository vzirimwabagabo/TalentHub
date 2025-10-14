// src/middlewares/adminCountMiddleware.js
const User = require('../models/User');

/**
 * Middleware to check if an admin already exists in the system
 * This prevents creation of multiple admin accounts
 */
exports.checkAdminCount = async (req, res, next) => {
  try {
    // Only apply this check when trying to create an admin
    if (req.body.role === 'admin') {
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
    }
    
    // If no admin exists or not creating an admin, proceed
    next();
  } catch (error) {
    console.error('Admin count check failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during admin validation'
    });
  }
};

/**
 * Middleware to verify admin creation secret
 * This ensures only authorized users can create an admin account
 */
exports.verifyAdminSecret = (req, res, next) => {
  // Only check secret when creating an admin
  if (req.body.role === 'admin') {
    const { adminSecret } = req.body;
    
    // Verify the admin secret matches the environment variable
    if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin creation secret'
      });
    }
    
    // Remove the secret from the request body to prevent it from being saved
    delete req.body.adminSecret;
  }
  
  next();
};