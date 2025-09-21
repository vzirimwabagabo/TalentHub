//server.js

require('dotenv-safe').config({
  example: './.env.example',
  allowEmptyValues: true
});

// Import modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

// Initialize Express app
const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined'));

// Rate Limiting (for API abuse prevention)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// === DYNAMIC ROUTE LOADER WITH SMART PLURALIZATION ===
const pluralMap = {
  talent: 'talents',
  portfolio: 'portfolio',     // intentional singular
  auth: 'auth',
  event: 'events',
  donation: 'donations',
  admin: 'admin',
  analytics: 'analytics',
  volunteer: 'volunteers',
  message: 'messages',
  notification: 'notifications',
  review: 'reviews',
  bookmark: 'bookmarks'
};

const routesDir = path.join(__dirname, 'src', 'routes');

try {
  fs.readdirSync(routesDir).forEach(file => {
    if (file.endsWith('Routes.js')) {
      const route = require(`./src/routes/${file}`);
      const baseName = file.replace('Routes.js', '');
      const apiPath = pluralMap[baseName.toLowerCase()] || baseName.toLowerCase();
      
      app.use(`/api/${apiPath}`, route);
      console.log(`✅ Mounted: /api/${apiPath}`);
    }
  });
} catch (err) {
  console.error('❌ Failed to load routes:', err);
  process.exit(1);
}

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Serve static files (e.g., portfolio uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Healthcheck route (must come after routes or be explicitly defined)
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    uptime: process.uptime(),
    message: 'RefuTalent backend is running!' 
  });
});

// 404 Handler - MUST BE AFTER ALL ROUTES
app.use((req, res) => {
  res.status(404).json({ 
    message: "Resource not found. Check the URL and HTTP method." 
  });
});

// Import and use global error handler LAST
const { errorHandler } = require('./src/middlewares/errorHandler');
app.use(errorHandler);

// Server Initialization
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`🔗 Try health check: GET http://localhost:${PORT}/api/health`);
});