const Message = require('../models/Message');

// Send a message from sender to receiver
async function sendMessage(sender, receiver, content) {
  const message = new Message({ sender, receiver, content });
  return await message.save();
}

// Retrieve all messages between user1 and user2 sorted by time
async function getConversation(userId1, userId2) {
  return await Message.find({
    $or: [
      { sender: userId1, receiver: userId2 },
      { sender: userId2, receiver: userId1 }
    ]
  }).sort({ sentAt: 1 });
}

// Mark a message as read by receiver
async function markMessageRead(userId, messageId) {
  const message = await Message.findOneAndUpdate(
    { _id: messageId, receiver: userId },
    { read: true },
    { new: true }
  );
  if (!message) throw new Error('Message not found or not authorized');
  return message;
}

module.exports = {
  sendMessage,
  getConversation,
  markMessageRead,
};
