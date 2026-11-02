const express = require('express');
const router = express.Router();
const { getDBStatus } = require('../config/db');

/**
 * @route   GET /api/health
 * @desc    System health check & diagnostics
 * @access  Public
 */
router.get('/', (req, res) => {
  const dbStatus = getDBStatus();
  const isDBConnected = dbStatus === 'connected';

  res.status(200).json({
    status: 'ok',
    service: 'AgriTech Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStatus,
      connected: isDBConnected,
      note: isDBConnected
        ? 'MongoDB Atlas live connection verified'
        : 'MongoDB connection not established or MONGODB_URI not set. Run in disconnected mode.',
    },
  });
});

module.exports = router;

