const express = require('express');
const router = express.Router();
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
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.delete('/all', protect, adminOnly, deleteAllUsers); 
router.delete('/:id', protect, adminOnly, deleteUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
