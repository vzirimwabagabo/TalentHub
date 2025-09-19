const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const {
  registerUser,
  loginUser,
  getUserProfile,
  deleteUser,
  deleteAllUsers,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');
// Auth Routes
router.post('/register', asyncHandler(registerUser));
router.post('/login', asyncHandler(loginUser));
router.get('/me', protect, asyncHandler(getUserProfile));
router.delete('/all', protect, adminOnly, asyncHandler(deleteAllUsers)); 
router.delete('/:id', protect, adminOnly, asyncHandler(deleteUser));
router.post('/forgot-password', asyncHandler(forgotPassword));
router.post('/reset-password/:token', asyncHandler(resetPassword));

module.exports = router;
