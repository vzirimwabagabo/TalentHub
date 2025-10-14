Controllers

//adminController

const User = require('../models/User');
const Donation = require('../models/Donation');
const TalentProfile = require('../models/TalentProfile');
const Volunteer = require('../models/Volunteer');
const Message = require('../models/Message');

// Get analytics data
exports.getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDonationsAggregate = await Donation.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalDonations = totalDonationsAggregate[0]?.total || 0;

    const mostActiveTalents = await TalentProfile.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('user', 'name email');

    const mostActiveVolunteers = await Volunteer.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('user', 'name email');

    const unreadMessages = await Message.countDocuments({ read: false });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalDonations,
        mostActiveTalents,
        mostActiveVolunteers,
        unreadMessages
      }
    });
  } catch (error) {
    next(error);
  }
};
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password -resetPasswordToken -resetPasswordExpires');
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// src/controllers/analyticsController.js

const User = require('../models/User');
const Donation = require('../models/Donation');
const Event = require('../models/Event');
const TalentProfile = require('../models/TalentProfile');

exports.getDashboardStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalDonations = await Donation.countDocuments();
        const totalEvents = await Event.countDocuments();
        const totalTalentProfiles = await TalentProfile.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalDonations,
                totalEvents,
                totalTalentProfiles
            }
        });
    } catch (error) {
        next(error);
    }
};


// authController

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');
const { sendResetPasswordEmail } = require('../utils/emailService');
const { sendWelcomeEmail } = require('../utils/emailSender');

// Generate JWT
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Register User
exports.registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email }); // No need to .select here
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Create user
        const user = await User.create({ name, email, password });
        await sendWelcomeEmail(user.email, user.name);

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            }
        });
    } catch (error) {
        next(error);
    }
};

// Login User
exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // We want to verify password, so we need the password field for this only
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        // When returning user data, exclude sensitive fields!
        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token: generateToken(user._id)
        });
    } catch (error) {
        next(error);
    }
};

// Get User Profile
exports.getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password -resetPasswordToken -resetPasswordExpires');
        res.status(200).json({
            success: true,
            data: user,
            isDeleted: false
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete all users except admin(s)
exports.deleteAllUsers = async (req, res, next) => {
    try {
        // Require explicit query param or header for confirmation
        if (req.query.confirm !== 'YES_DELETE') {
            return res.status(400).json({ success: false, message: 'Explicit confirmation required to delete all users.' });
        }
        await User.deleteMany({ role: { $ne: 'admin' } });
        res.status(200).json({ success: true, message: 'All non-admin users deleted.' });
    } catch (error) {
        next(error);
    }
};

// Forgot Password
exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        // No need to select fields to exclude for internal password reset logic
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        await sendResetPasswordEmail(user.email, resetUrl);

        res.status(200).json({
            success: true,
            message: 'Password reset email sent'
        });
    } catch (error) {
        next(error);
    }
};

// Reset Password
exports.resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params; // Make sure token is passed in the URL
        const { password } = req.body; // New password

        if (!token) {
            return res.status(400).json({ success: false, message: 'Token is required.' });
        }

        if (!password) {
            return res.status(400).json({ success: false, message: 'Password is required.' });
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find the user with the matching reset token and valid expiry
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token.' });
        }

        // Update password and clear reset fields
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successful. You can now log in.'
        });
    } catch (error) {
        next(error);
    }
};

// bookmark

const Bookmark = require('../models/Bookmark');

// Create a new bookmark
exports.addBookmark = async (req, res, next) => {
    try {
        const { itemId, itemType } = req.body;
        const userId = req.user._id;

        // Check if the bookmark already exists
        const existingBookmark = await Bookmark.findOne({ user: userId, itemId, itemType });
        if (existingBookmark) {
            return res.status(400).json({
                success: false,
                message: 'Bookmark already exists'
            });
        }

        const bookmark = await Bookmark.create({
            user: userId,
            itemId,
            itemType
        });

        res.status(201).json({
            success: true,
            message: 'Bookmark added successfully',
            data: bookmark
        });
    } catch (error) {
        next(error);
    }
};

// Get all bookmarks for the logged-in user
exports.getBookmarks = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const bookmarks = await Bookmark.find({ user: userId })
            .populate('itemId')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: bookmarks
        });
    } catch (error) {
        next(error);
    }
};

// Delete a bookmark
exports.deleteBookmark = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;

        const bookmark = await Bookmark.findOneAndDelete({ _id: id, user: userId });
        if (!bookmark) {
            return res.status(404).json({
                success: false,
                message: 'Bookmark not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Bookmark deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};


// donation

// src/controllers/donationController.js

const Donation = require('../models/Donation');

// Create a new donation
exports.createDonation = async (req, res, next) => {
    try {
        const { amount, description } = req.body;
        const userId = req.user._id;

        const newDonation = await Donation.create({
            user: userId,
            amount,
            description
        });

        res.status(201).json({
            success: true,
            message: 'Donation recorded successfully',
            data: newDonation
        });
    } catch (error) {
        next(error);
    }
};

// Get all donations (Admin only)
exports.getAllDonations = async (req, res, next) => {
    try {
        const donations = await Donation.find().populate('user', 'name email');
        res.status(200).json({
            success: true,
            data: donations
        });
    } catch (error) {
        next(error);
    }
};

// Get donations by user
exports.getUserDonations = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const donations = await Donation.find({ user: userId });
        res.status(200).json({
            success: true,
            data: donations
        });
    } catch (error) {
        next(error);
    }
};
exports.getDonationById = async (req, res, next) => {
    try {
        const donation = await Donation.findById(req.params.id).populate('user', 'name email');
        if (!donation) {
            return res.status(404).json({ success: false, message: 'Donation not found' });
        }
        res.status(200).json({ success: true, data: donation });
    } catch (error) {
        next(error);
    }
};
exports.deleteDonation = async (req, res, next) => {
    try {
        const donation = await Donation.findByIdAndDelete(req.params.id);
        if (!donation) {
            return res.status(404).json({ success: false, message: 'Donation not found' });
        }
        res.status(200).json({ success: true, message: 'Donation deleted successfully' });
    } catch (error) {
        next(error);
    }
};


//eventController

// src/controllers/eventController.js

const Event = require('../models/Event');

// Create a new event
exports.createEvent = async (req, res, next) => {
    try {
        const { title, description, date, location } = req.body;
        const createdBy = req.user._id;

        const event = await Event.create({
            title,
            description,
            date,
            location,
            image,
            createdBy
        });

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: event
        });
    } catch (error) {
        next(error);
    }
};

// Get all events
exports.getAllEvents = async (req, res, next) => {
    try {
        const events = await Event.find({isDeleted: false}).populate('createdBy', 'name email');
        res.status(200).json({
            success: true,
            data: events
        });
    } catch (error) {
        next(error);
    }
};

// Get a single event by ID
exports.getEventById = async (req, res, next) => {
    try {
        const event = await Event.findById({_id: req.params.id, isDeleted: false}).populate('createdBy', 'name email');
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        next(error);
    }
};
// Update an event by ID
exports.updateEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        // Only allow the creator or an admin to update
        if (!event.createdBy.equals(req.user._id) && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        const { title, description, date, location } = req.body;
        event.title = title || event.title;
        event.description = description || event.description;
        event.date = date || event.date;
        event.location = location || event.location;

        await event.save();

        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            data: event
        });
    } catch (error) {
        next(error);
    }
};

// Delete an event by ID
exports.deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        // Only allow the creator or an admin to delete
        if (!event.createdBy.equals(req.user._id) && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        event.isDeleted = true; // Soft delete
        await event.save();

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// messageController

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


// notificationController


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


//portfolioController

const asyncHandler = require('express-async-handler');
const Portfolio = require('../models/Portfolio');
const TalentProfile = require('../models/TalentProfile');
const fs = require('fs').promises;
const path = require('path');

const UPLOAD_DIR = path.join(__dirname, '../uploads');

// @desc    Add a new portfolio item (after upload)
// @route   POST /api/portfolio
// @access  Private
const addPortfolioItem = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user._id;

  const talent = await TalentProfile.findOne({ user: userId });
  if (!talent) {
    res.status(404);
    throw new Error('Talent profile not found');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const { filename, path: filePath, mimetype } = req.file;

  let mediaType = req.fileType; // if set by middleware
  if (!mediaType) {
    if (mimetype.startsWith('image')) mediaType = 'image';
    else if (mimetype.startsWith('video')) mediaType = 'video';
    else if (mimetype === 'application/pdf') mediaType = 'pdf';
    else {
      await fs.unlink(filePath); // cleanup
      res.status(400);
      throw new Error('Unsupported file type');
    }
  }

  const portfolioItem = await Portfolio.create({
    talent: talent._id,
    title: title || 'Untitled Work',
    description,
    mediaType,
    url: `/uploads/${filename}`,
    fileName: filename
  });

  res.status(201).json({
    success: true,
    data: portfolioItem
  });
});

// @desc    Get current user's portfolio items
// @route   GET /api/portfolio/my
// @access  Private
const getMyPortfolioItems = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const talent = await TalentProfile.findOne({ user: userId });

  if (!talent) {
    res.status(404);
    throw new Error('Talent profile not found');
  }

  const items = await Portfolio.find({ talent: talent._id }).sort({ order: 1 });
  res.json({
    success: true,
    count: items.length,
    data: items
  });
});

// @desc    Update portfolio item
// @route   PUT /api/portfolio/:id
// @access  Private
const updatePortfolioItem = asyncHandler(async (req, res) => {
  const { title, description, order } = req.body;
  const item = await Portfolio.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error('Portfolio item not found');
  }

  const talent = await TalentProfile.findById(item.talent).populate('user');
  if (talent.user._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  item.title = title || item.title;
  item.description = description || item.description;
  if (order !== undefined) {
    const numOrder = parseInt(order);
    if (!isNaN(numOrder)) {
      item.order = numOrder;
    }
  }

  await item.save();

  res.json({
    success: true,
    data: item
  });
});

// @desc    Delete portfolio item + file
// @route   DELETE /api/portfolio/:id
// @access  Private
const deletePortfolioItem = asyncHandler(async (req, res) => {
  const item = await Portfolio.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Portfolio item not found');
  }

  const talent = await TalentProfile.findById(item.talent).populate('user');
  if (talent.user._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const fullPath = path.join(UPLOAD_DIR, item.fileName);
  try {
    await fs.unlink(fullPath);
  } catch (err) {
    console.warn('Failed to delete file:', fullPath, err.message);
    // Don't fail the request — DB delete should still happen
  }

  await item.deleteOne();
  res.json({
    success: true,
    message: 'Portfolio item deleted'
  });
});

module.exports = {
  addPortfolioItem,
  getMyPortfolioItems,
  updatePortfolioItem,
  deletePortfolioItem
};


// reviewController

// src/controllers/reviewController.js

const Review = require('../models/Review');

// Create a new review
exports.createReview = async (req, res, next) => {
    try {
        const { content, rating } = req.body;
        const userId = req.user._id;

        const review = await Review.create({
            user: userId,
            content,
            rating
        });

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            data: review
        });
    } catch (error) {
        next(error);
    }
};

// Get user's reviews
exports.getUserReviews = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const reviews = await Review.find({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: reviews
        });
    } catch (error) {
        next(error);
    }
};

// Admin: Get all reviews
exports.getAllReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find().populate('user', 'name email');
        res.status(200).json({
            success: true,
            data: reviews
        });
    } catch (error) {
        next(error);
    }
};

// Delete a review
exports.deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        // Only allow the review owner or an admin to delete
        if (!review.user.equals(req.user._id) && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        await review.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};


//talentController

// src/controllers/talentController.js
const TalentProfile = require('../models/TalentProfile');

// Create a new talent profile
exports.createTalentProfile = async (req, res, next) => {
  try {
    const { bio, skills, headline } = req.body;
    const userId = req.user._id;

    // Check if profile already exists
    const existingProfile = await TalentProfile.findOne({ user: userId });
    if (existingProfile) {
      return res.status(400).json({ 
        success: false, 
        message: 'Profile already exists' 
      });
    }

    const newProfile = await TalentProfile.create({
      user: userId,
      bio,
      skills,
      headline,
      isDeleted: false
    });

    res.status(201).json({
      success: true,
      message: 'Talent profile created successfully',
      data: newProfile
    });
  } catch (error) {
    next(error);
  }
};

// Get the current user's talent profile
exports.getTalentProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const profile = await TalentProfile.findOne({
      user: userId,
      isDeleted: false 
    }).populate('user', 'name email');

    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        message: 'Profile not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// Update the current user's talent profile
exports.updateTalentProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { bio, skills, headline } = req.body;

    const profile = await TalentProfile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        message: 'Profile not found' 
      });
    }

    // Only update fields that are provided
    profile.bio = bio ?? profile.bio;
    profile.skills = skills ?? profile.skills;
    profile.headline = headline ?? profile.headline;

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Talent profile updated successfully',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// Soft-delete the current user's talent profile
exports.deleteTalentProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const result = await TalentProfile.updateOne(
      { user: userId },
      { isDeleted: true }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Profile not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Talent profile deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all active talent profiles
exports.getAllTalentProfiles = async (req, res, next) => {
  try {
    const profiles = await TalentProfile.find({ isDeleted: false })
      .populate('user', 'name email role')
      .select('-createdAt -updatedAt -__v');

    res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles
    });
  } catch (error) {
    next(error);
  }
};

// Public: Get a single talent profile by ID
exports.getTalentProfileById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const profile = await TalentProfile.findById(id)
      .populate('user', 'name email')
      .select('-createdAt -updatedAt -__v');

    if (!profile || profile.isDeleted) {
      return res.status(404).json({ 
        success: false, 
        message: 'Profile not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};


//userController

const User = require('../models/User');

// Get all users (admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password -resetPasswordToken -resetPasswordExpires');
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

// Get a user by ID (public profile)
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password -resetPasswordToken -resetPasswordExpires');
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// Update own profile
exports.updateUserProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true })
      .select('-password -resetPasswordToken -resetPasswordExpires');
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};


// volunteerController
const Volunteer = require('../models/Volunteer');

// Create or update volunteer profile
exports.createVolunteerProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { bio, availability } = req.body;

    // Check if profile already exists
    const existingProfile = await Volunteer.findOne({ user: userId });
    if (existingProfile) {
      return res.status(400).json({ success: false, message: 'Volunteer profile already exists' });
    }

    // Create profile
    const profile = await Volunteer.create({
      user: userId,
      bio,
      availability
    });

    res.status(201).json({
      success: true,
      message: 'Volunteer profile created',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};


// Admin: View all volunteers
exports.getAllVolunteers = async (req, res, next) => {
    try {
        const volunteers = await Volunteer.find().populate('user', 'name email role');
        res.status(200).json({ success: true, data: volunteers });
    } catch (error) {
        next(error);
    }
};

// Admin: Approve or reject volunteer
exports.updateVolunteerStatus = async (req, res, next) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id);
        if (!volunteer) {
            return res.status(404).json({ success: false, message: 'Volunteer not found' });
        }
        volunteer.status = req.body.status;
        await volunteer.save();
        res.status(200).json({ success: true, message: `Volunteer ${volunteer.status}`, data: volunteer });
    } catch (error) {
        next(error);
    }
};

// Admin: Delete volunteer
exports.deleteVolunteer = async (req, res, next) => {
    try {
        const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
        if (!volunteer) {
            return res.status(404).json({ success: false, message: 'Volunteer not found' });
        }
        res.status(200).json({ success: true, message: 'Volunteer deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Get the current user's volunteer profile
exports.getVolunteerProfile = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const profile = await Volunteer.findOne({ user: userId,isDeleted: false }).populate('user', 'name email');
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Volunteer profile not found' });
        }
        res.status(200).json({ success: true, data: profile });
    } catch (error) {
        next(error);
    }
};

// Update the current user's volunteer profile
exports.updateVolunteerProfile = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { bio, availability } = req.body;

        const profile = await Volunteer.findOne({ user: userId });
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Volunteer profile not found' });
        }

        profile.bio = bio || profile.bio;
        profile.availability = availability || profile.availability;
        await profile.save();

        res.status(200).json({
            success: true,
            message: 'Volunteer profile updated successfully',
            data: profile
        });
    } catch (error) {
        next(error);
    }
};

// Delete the current user's volunteer profile
exports.deleteVolunteerProfile = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const profile = await Volunteer.findOneAndDelete({ user: userId });
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Volunteer profile not found' });
        }

        res.status(200).json({ success: true, message: 'Volunteer profile deleted successfully' });
    } catch (error) {
        next(error);
    }
};
