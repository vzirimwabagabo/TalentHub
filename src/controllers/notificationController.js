const notificationService = require('../services/notificationService');

// Create a new notification
exports.createNotification = async (req, res, next) => {
  try {
    const { recipientId, type, message, link } = req.body;
    const notification = await notificationService.createNotification(recipientId, type, message, link);
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

// Get all notifications for logged-in user
exports.getMyNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const notifications = await notificationService.getUserNotifications(userId);
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res, next) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user._id;
    const updatedNotification = await notificationService.markNotificationRead(userId, notificationId);
    res.status(200).json({ success: true, data: updatedNotification });
  } catch (error) {
    next(error);
  }
};

// Delete a notification
exports.deleteNotification = async (req, res, next) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user._id;
    await notificationService.deleteNotification(userId, notificationId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
