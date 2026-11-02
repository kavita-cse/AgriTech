const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const { globalLimiter } = require('./middleware/rateLimiter');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const farmRoutes = require('./routes/farmRoutes');
const cropRoutes = require('./routes/cropRoutes');
const soilRoutes = require('./routes/soilRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const marketRoutes = require('./routes/marketRoutes');
const forumRoutes = require('./routes/forumRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Load environment variables from .env if present
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Global Middleware (Applied to ALL routes per Architecture Version 2.3)
// 1.1 Helmet: Sets security-related HTTP response headers
app.use(helmet());

// 1.2 CORS: Controls browser cross-origin requests
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// 1.3 Rate Limiter: Blocks excessive requests and brute force
app.use(globalLimiter);

// 1.4 JSON & URL-encoded Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 2. Application Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/soil', soilRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api', marketRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/admin', adminRoutes);

// 3. Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

// 4. Server Initialization & Database Connection
let server;

const startServer = async () => {
  try {
    // Attempt database connection (does not crash if MONGODB_URI is absent)
    await connectDB();

    server = app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`🌱 AgriTech Backend API Server`);
      console.log(`🚀 Running on port: ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
      console.log(`=========================================`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ [Server Error] Port ${PORT} is already in use. Please use a different PORT in .env.`);
      } else {
        console.error(`❌ [Server Error] Failed to bind server: ${error.message}`);
      }
      process.exit(1);
    });
  } catch (err) {
    console.error(`❌ [Fatal Startup Error] ${err.message}`);
    process.exit(1);
  }
};

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('⚠️  SIGTERM signal received: closing HTTP server...');
  if (server) {
    server.close(() => {
      console.log('HTTP server closed.');
    });
  }
});

startServer();

module.exports = app;

