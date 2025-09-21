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
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation
} = require('../middlewares/validation');
const validateRequest = require('../middlewares/validateRequest');

router.post('/register', registerValidation, validateRequest, asyncHandler(registerUser));
router.post('/login', loginValidation, validateRequest, asyncHandler(loginUser));
router.get('/me', protect, asyncHandler(getUserProfile));
router.delete('/all', protect, adminOnly, asyncHandler(deleteAllUsers));
router.delete('/:id', protect, adminOnly, asyncHandler(deleteUser));
router.post('/forgot-password', forgotPasswordValidation, validateRequest, asyncHandler(forgotPassword));
router.post('/reset-password/:token', resetPasswordValidation, validateRequest, asyncHandler(resetPassword));

module.exports = router;