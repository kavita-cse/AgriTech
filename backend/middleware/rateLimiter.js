const rateLimit = require('express-rate-limit');

/**
 * Global Rate Limiter
 * Blocks excessive requests and brute-force attempts.
 * Applied globally to all routes per Architecture Version 2.3.
 */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute sliding window
  max: 100, // limit each IP to 100 requests per 15 minutes
  standardHeaders: true, // Return rate limit info in standard `RateLimit-*` headers
  legacyHeaders: false, // Disable older `X-RateLimit-*` headers
  message: {
    status: 'error',
    message: 'Too many requests from this IP address. Please try again after 15 minutes.',
  },
});

module.exports = {
  globalLimiter,
};

