// src/server.js

// ✅ Load environment variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv-safe').config({
    example: './.env.example',
    allowEmptyValues: true,
  });
} else {
  require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { errorHandler } = require('./middlewares/errorHandlerMiddleware');

const app = express();

// ===============================
// 🔒 Security Middleware
// ===============================
// app.use(helmet());

// const allowedOrigins = [
//   process.env.CLIENT_URL || 'http://localhost:3000','http://localhost:5000'
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     // allow requests with no origin (like mobile apps or curl)
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.includes(origin)) return callback(null, true);
//     return callback(new Error('Not allowed by CORS'));
//   },
//   credentials: true,
// }));
app.use(cors({ origin: true, credentials: true }));


// ===============================
// 📦 Body Parsing
// ===============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// 🧾 Logging
// ===============================
app.use(morgan('combined'));

// ===============================
// 🚦 Rate Limiting
// ===============================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// ===============================
// 📁 Dynamic Route Loader
// ===============================
const routesDir = path.join(__dirname, 'routes');

try {
  fs.readdirSync(routesDir).forEach((file) => {
    if (file.endsWith('Routes.js')) {
      const route = require(`./routes/${file}`);
      const baseName = file.replace('Routes.js', '').toLowerCase();
      app.use(`/api/v1/${baseName}`, route);
      console.log(`✅ Mounted: /api/v1/${baseName}`);
    }
  });
} catch (err) {
  console.error('❌ Failed to load routes:', err);
}

// ===============================
// 🧩 MongoDB Connection
// ===============================
async function connectDB() {
  try {
    let mongoURI;

    if (process.env.NODE_ENV === 'development') {
      // 🧠 Use in-memory MongoDB for local dev/testing
      const mongod = await MongoMemoryServer.create();
      mongoURI = mongod.getUri();
      console.log('✅ Using In-Memory MongoDB (Development)');
    } else {
      // 🌍 Use Atlas or external MongoDB in production
      mongoURI = process.env.TALENTHUBDB_MONGODB_URI || process.env.MONGO_URI;
      if (!mongoURI) throw new Error('❌ Missing MongoDB connection string.');
      console.log('✅ Using MongoDB Atlas (Production)');
    }

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log('✅ MongoDB connection successful!');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
  }
}

connectDB();
// 🏁 Local Development Startup
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally on port ${PORT}`);
  });
}

// ===============================
// 🖼️ Static Files
// ===============================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===============================
// 🌐 Language Endpoint
// ===============================
app.get('/api/v1/languages', (req, res) => {
  res.json({ languages: ['en', 'fr', 'sw'] });
});

// ===============================
// 📘 Swagger API Docs
// ===============================
const swaggerSpec = swaggerJsdoc({
  swaggerDefinition: {
    openapi: '3.0.0',
    info: { title: 'TalentHub API', version: '1.0.0' },
  },
  apis: ['./src/routes/*.js'],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ===============================
// ❤️ Health Check
// ===============================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    message: 'TalentHub backend is running!',
  });
});

// ===============================
// ⚠️ Error Handlers
// ===============================
app.use(errorHandler);

app.use((err, req, res, next) => {
  console.error('❌ SERVER ERROR:', err.stack || err.message);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});


// ===============================
// 🚀 Export for Vercel
// ===============================
module.exports = app; // Do NOT use app.listen() for Vercel
