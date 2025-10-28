const messageService = require('../services/messageService');

// Send a new message
exports.sendMessage = async (req, res, next) => {
  try {
    const sender = req.user._id;
    const { receiver, content } = req.body;

    const message = await messageService.sendMessage(sender, receiver, content);
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

// Get messages between current user and another user (conversation)
exports.getConversation = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const otherUserId = req.params.userId;

    const messages = await messageService.getConversation(userId, otherUserId);
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

// Mark message as read
exports.markMessageRead = async (req, res, next) => {
  try {
    const messageId = req.params.id;
    const userId = req.user._id;

    const updatedMessage = await messageService.markMessageRead(userId, messageId);
    res.status(200).json({ success: true, data: updatedMessage });
  } catch (error) {
    next(error);
  }
};
