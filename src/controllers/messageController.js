// controllers/messageController.js

const Message = require('../models/Message');

// Send a message
exports.sendMessage = async (req, res, next) => {
    try {
        const { recipient, content } = req.body;
        const sender = req.user._id;

        const message = await Message.create({
            sender,
            recipient,
            content
        });

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: message
        });
    } catch (error) {
        next(error);
    }
};

// Get all messages for the logged-in user
exports.getUserMessages = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const messages = await Message.find({
    $and: [
        {
            $or: [
                { sender: userId },
                { recipient: userId }
            ]
        },
        { isDeleted: false }
    ]
})

        .populate('sender', 'name email')
        .populate('recipient', 'name email')
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (error) {
        next(error);
    }
};

// Mark a message as read
exports.markAsRead = async (req, res, next) => {
    try {
        const { id } = req.params;
        const message = await Message.findById(id);

        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        // Only recipient can mark as read
        if (!message.recipient.equals(req.user._id)) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        message.read = true;
        await message.save();

        res.status(200).json({
            success: true,
            message: 'Message marked as read'
        });
    } catch (error) {
        next(error);
    }
};
// Delete a message
exports.deleteMessage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const message = await Message.findById(id);

        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        // Allow sender or recipient to delete
        if (!message.sender.equals(userId) && !message.recipient.equals(userId)) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        message.isDeleted = true;
        await message.save();

        res.status(200).json({
            success: true,
            message: 'Message deleted successfully'
        });    
    } catch (error) {
        next(error);
    }
};

// Get all unread messages for the logged-in user
exports.getUnreadMessages = async (req, res, next) => {
    try {
        const messages = await Message.find({
            recipient: req.user._id,
            read: false
        })
        .populate('sender', 'name email')
        .populate('recipient', 'name email')
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (error) {
        next(error);
    }
};

