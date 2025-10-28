const Notification = require('../models/Notification');

async function createNotification(recipientId, type, message, link = null) {
  // Validation of type could be done here or as model enum validation
  const notification = new Notification({ recipient: recipientId, type, message, link });
  return await notification.save();
}

async function getUserNotifications(userId) {
  return await Notification.find({ recipient: userId }).sort({ createdAt: -1 });
}

async function markNotificationRead(userId, notificationId) {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { read: true },
    { new: true }
  );
  if (!notification) throw new Error('Notification not found or not authorized');
  return notification;
}

async function deleteNotification(userId, notificationId) {
  const result = await Notification.findOneAndDelete({ _id: notificationId, recipient: userId });
  if (!result) throw new Error('Notification not found or not authorized');
}

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationRead,
  deleteNotification,
};
