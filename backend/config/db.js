const mongoose = require('mongoose');
const dns = require('dns');

// On Windows, Node.js often defaults to local loopback 127.0.0.1 as DNS resolver,
// which rejects SRV queries (querySrv ECONNREFUSED). Configure public DNS servers for Atlas SRV resolution.
try {
  const currentServers = dns.getServers();
  if (!currentServers || currentServers.length === 0 || currentServers.includes('127.0.0.1')) {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  }
} catch (e) {
  // If setting DNS servers fails, proceed with default resolver
}

/**
 * Connect to MongoDB database via Mongoose
 * Uses the MONGODB_URI environment variable
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn(
      '⚠️  [Database Warning] MONGODB_URI is not set in environment variables.\n' +
      '   Database is currently disconnected. Health-check endpoint will report disconnected status.\n' +
      '   Configure MONGODB_URI in backend/.env to establish a live MongoDB Atlas connection.'
    );
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });

    console.log(`✅ [Database Connected] MongoDB Host: ${conn.connection.host}`);
    return true;
  } catch (error) {
    // Sanitize any credentials from error messages to protect sensitive data
    const safeMsg = (error.message || '').replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
    console.error(`❌ [Database Error] Failed to connect to MongoDB: ${safeMsg}`);
    return false;
  }
};

/**
 * Returns current database connection status
 */
const getDBStatus = () => {
  // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[mongoose.connection.readyState] || 'unknown';
};

module.exports = {
  connectDB,
  getDBStatus,
};
