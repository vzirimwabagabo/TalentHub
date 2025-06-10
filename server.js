/**
 * server.js
 * TalentHub Backend Server Entry Point
 * Author: Mr. Valentin Zirimwabagabo (with assistance from ChatGPT)
 */
require('dotenv').config();
require('dotenv-safe').config({
  example: './.env.example',
  allowEmptyValues: true
});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
// Import error handler
const { errorHandler } = require('./src/middlewares/errorHandler');

// Import route modules
const authRoutes = require('./src/routes/authRoutes');
const talentRoutes = require('./src/routes/talentRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const donationRoutes = require('./src/routes/donationRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const volunteerRoutes = require('./src/routes/volunteerRoutes');
const messageRoutes = require('./src/routes/messageRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const bookmarkRoutes = require('./src/routes/bookmarkRoutes');

// Initialize Express app
const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL, // restrict origins for security
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Rate Limiting (for API abuse prevention) 
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false
});
app.use('/api/', limiter);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });


// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/talents', talentRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/bookmarks', bookmarkRoutes);

// ... (add all other feature routes here)

// Serve static files (for portfolio images, videos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Global Error Handler
app.use(errorHandler);

// Server Initialization
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
