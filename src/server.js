// src/server.js
require('dotenv-safe').config({
  example: './.env.example',
  allowEmptyValues: true,
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

// ====== Security Middleware ======
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);

// ====== Body Parsing ======
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ====== Logging ======
app.use(morgan('combined'));

// ====== Rate Limiting ======
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// ====== Dynamic Route Loader ======
const pluralMap = {}; // you can fill this mapping if needed
const routesDir = path.join(__dirname, 'routes');

try {
  fs.readdirSync(routesDir).forEach((file) => {
    if (file.endsWith('Routes.js')) {
      const route = require(`./routes/${file}`);
      const baseName = file.replace('Routes.js', '');
      const apiPath = pluralMap[baseName.toLowerCase()] || baseName.toLowerCase();
      app.use(`/api/v1/${apiPath}`, route);
      console.log(`✅ Mounted: /api/v1/${apiPath}`);
    }
  });
} catch (err) {
  console.error('❌ Failed to load routes:', err);
}

// ====== Database Connection ======
const { MongoMemoryServer } = require('mongodb-memory-server');

async function connectDB() {
  try {
    if (process.env.NODE_ENV === 'development') {
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('✅ Connected to In-Memory MongoDB (Development)');
    } else {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('✅ Connected to MongoDB');
    }
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
}

connectDB();

// ====== Static Files ======
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ====== Languages API ======
app.get('/api/v1/languages', (req, res) => {
  res.json({ languages: ['en', 'fr', 'sw'] });
});

// ====== Swagger Documentation ======
const swaggerSpec = swaggerJsdoc({
  swaggerDefinition: {
    openapi: '3.0.0',
    info: { title: 'TalentHub API', version: '1.0.0' },
  },
  apis: ['./src/routes/*.js'],
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ====== Health Check ======
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    message: 'TalentHub backend is running!',
  });
});

// ====== 404 Handler ======
app.use((req, res) => {
  res.status(404).json({
    message: 'Resource not found. Check the URL and HTTP method.',
  });
});

// ====== Error Handler ======
app.use(errorHandler);

// ====== Export Express App ======
// Important for Vercel – do not call app.listen() here
module.exports = app;
