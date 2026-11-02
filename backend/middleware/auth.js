const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Route-level Authentication Middleware
 * Verifies JWT signature and checks live isActive status in the database on every protected request.
 * Header format: Authorization: Bearer <token>
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required. No token provided.',
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Malformed authorization header. Expected format: Bearer <token>.',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication token missing.',
      });
    }

    // Verify token signature and expiration
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtErr) {
      if (jwtErr.name === 'TokenExpiredError') {
        return res.status(401).json({
          status: 'error',
          message: 'Token has expired. Please log in again.',
        });
      }
      return res.status(401).json({
        status: 'error',
        message: 'Invalid authentication token.',
      });
    }

    // Query database to ensure user still exists and verify live isActive status
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'The user belonging to this token no longer exists.',
      });
    }

    // Deactivation check: takes effect immediately on the very next request
    if (!user.isActive) {
      return res.status(403).json({
        status: 'error',
        message: 'Account has been deactivated. Access denied.',
      });
    }

    // Attach verified user document to request object
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Route-level Role-Based Authorization Middleware
 * Verifies that the authenticated user possesses an allowed role.
 *
 * @param  {...string} allowedRoles Roles permitted to access the route
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: `Access forbidden: Role '${req.user.role}' is not authorized to access this resource.`,
      });
    }

    next();
  };
};

/**
 * Route-level Expert Verification Middleware
 * Queries live database status to ensure expert has been verified by admin.
 * Pending and rejected experts are blocked from restricted expert actions.
 */
const requireVerifiedExpert = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required.',
      });
    }

    if (req.user.role !== 'expert') {
      return res.status(403).json({
        status: 'error',
        message: 'Access forbidden: Only agricultural experts can access this resource.',
      });
    }

    // Live DB verification check
    if (req.user.expertVerificationStatus !== 'verified') {
      return res.status(403).json({
        status: 'error',
        message: `Access forbidden: Your expert account is currently '${req.user.expertVerificationStatus}'. Verified status is required for this action.`,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Route-level Ownership Middleware (Prevents IDOR / Horizontal Privilege Escalation)
 * Verifies that the requested resource belongs to the requesting user.
 * Admin bypasses ownership check.
 */
const checkOwnership = (Model, ownerField = 'farmerId') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      if (!resourceId) {
        return res.status(400).json({ status: 'error', message: 'Resource ID is required.' });
      }

      const resource = await Model.findById(resourceId);
      if (!resource) {
        return res.status(404).json({ status: 'error', message: 'Requested resource not found.' });
      }

      // Allow admin or exact resource owner
      const isOwner = resource[ownerField]?.toString() === req.user._id.toString();
      const isAdmin = req.user.role === 'admin';

      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          status: 'error',
          message: 'Access forbidden: You do not have permission to access or modify this record.',
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Route-level Forum Write Permission Middleware
 * Enforces that pending and rejected experts have read-only forum access.
 */
const requireForumWritePermission = (req, res, next) => {
  if (req.user.role === 'expert' && req.user.expertVerificationStatus !== 'verified') {
    return res.status(403).json({
      status: 'error',
      message: `Access denied. Agricultural experts with '${req.user.expertVerificationStatus}' status have read-only access to community discussions.`,
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  requireVerifiedExpert,
  checkOwnership,
  requireForumWritePermission,
};
