// src/server.js

// ✅ Load environment variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv-safe').config({
    example: './.env.example',
    allowEmptyValues: true
  });
} else {
  require('dotenv').config();
}

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
const pluralMap = {}; // Optional mapping if you want to pluralize route names
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

const { MongoMemoryServer } = require('mongodb-memory-server');

async function connectDB() {
  try {
    if (process.env.NODE_ENV === 'development') {
      // 🧩 Local or development environment (uses in-memory MongoDB)
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('✅ Connected to In-Memory MongoDB (Development)');
    } else {
      // 🌍 Production connection (MongoDB Atlas)
      const mongoURI =
        process.env.TALENTHUB_URL || process.env.MONGO_URI;

      if (!mongoURI) {
        throw new Error('❌ Missing MongoDB connection string.');
      }

      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000, // ⏱ avoid hanging connections
      });

      console.log('✅ Connected to MongoDB Atlas (Production)');
    }
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
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
// ====== Error Handler ======
app.use((err, req, res, next) => {
  console.error('❌ SERVER ERROR:', err.stack || err.message);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// ====== Error Handler ======
app.use(errorHandler);

// ====== Export Express App ======
module.exports = app; // Required by Vercel (no app.listen)
