const Notification = require('../models/Notification');

// Create Notification
exports.createNotification = async (req, res, next) => {
    try {
        const { user, message, type } = req.body;

        const notification = await Notification.create({
            user,
            message,
            type
        });

        res.status(201).json({
            success: true,
            message: 'Notification created successfully',
            data: notification
        });
    } catch (error) {
        next(error);
    }
};

// Get Notifications for Current User
exports.getMyNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: notifications
        });
    } catch (error) {
        next(error);
    }
};

// Mark Notification as Read
exports.markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        if (!notification.user.equals(req.user._id)) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        notification.read = true;
        await notification.save();

        res.status(200).json({
            success: true,
            message: 'Notification marked as read'
        });
    } catch (error) {
        next(error);
    }
};

// Delete Notification
exports.deleteNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        if (!notification.user.equals(req.user._id)) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        await notification.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
