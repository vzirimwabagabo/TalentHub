const express = require('express');
const { protect, authorize } = require('../middleware');
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const router = express.Router();

router.route('/')
  .get(protect, authorize('admin'), getAllUsers);

router.route('/:id')
  .get(protect, authorize('admin','supporter'), getUserById)
  .put(protect, authorize('admin','supporter'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);

module.exports = router;
