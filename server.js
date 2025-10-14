//src/server.js
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
const fs = require('fs');
const http = require('http');
const { Server } = require('socket.io');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { errorHandler } = require('./src/middlewares/errorHandler');

const PORT = process.env.PORT || 5000;
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

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// === DYNAMIC ROUTE LOADER ===
const pluralMap = { /* ... */ };
const routesDir = path.join(__dirname, 'src', 'routes');
try {
  fs.readdirSync(routesDir).forEach(file => {
    if (file.endsWith('Routes.js')) {
      const route = require(`./src/routes/${file}`);
      const baseName = file.replace('Routes.js', '');
      const apiPath = pluralMap[baseName.toLowerCase()] || baseName.toLowerCase();
      app.use(`/api/v1/${apiPath}`, route);
      console.log(`✅ Mounted: /api/v1/${apiPath}`);
    }
  });
} catch (err) {
  console.error('❌ Failed to load routes:', err);
  process.exit(1);
}

// Database Connection
const { MongoMemoryServer } = require('mongodb-memory-server');

// Start MongoDB Memory Server for development
async function connectDB() {
  try {
    if (process.env.NODE_ENV === 'development') {
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('✅ MongoDB Memory Server Connected');
    } else {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('✅ MongoDB Connected');
    }
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
}

connectDB();

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/api/v1/languages', (req, res) => {
  res.json({ languages: ['en', 'fr', 'sw'] });
});

// Swagger setup
const swaggerSpec = swaggerJsdoc({
  swaggerDefinition: {
    openapi: '3.0.0',
    info: { title: 'TalentHub API', version: '1.0.0' }
  },
  apis: ['./src/routes/*.js'],
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    message: 'TalentHub backend is running!'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    message: "Resource not found. Check the URL and HTTP method."
  });
});

// Error Handler
app.use(errorHandler);

// Create HTTP server and Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL, credentials: true }
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('sendMessage', (data) => {
    io.to(data.recipientId).emit('receiveMessage', data);
  });

  socket.on('join', (userId) => {
    socket.join(userId);
  });

  socket.on('sendNotification', (notif) => {
    io.to(notif.userId).emit('receiveNotification', notif);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`🔗 Try health check: GET http://localhost:${PORT}/api/health`);
});