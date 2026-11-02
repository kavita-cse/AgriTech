const { body, validationResult } = require('express-validator');

/**
 * Middleware to check validation results and return formatted 400 Bad Request if any errors exist
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed. Please correct the highlighted errors.',
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * Route-level validation chain for Public User Registration
 * Public API strictly permits: farmer, expert, vendor, buyer.
 * Admin registration is explicitly rejected.
 */
const registerValidationRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),

  body('role')
    .trim()
    .notEmpty()
    .withMessage('Role is required')
    .custom((value) => {
      if (value === 'admin') {
        throw new Error(
          'Admin accounts cannot be registered via public registration.'
        );
      }
      const allowedRoles = ['farmer', 'expert', 'vendor', 'buyer'];
      if (!allowedRoles.includes(value)) {
        throw new Error(
          `Invalid role '${value}'. Allowed roles: ${allowedRoles.join(', ')}`
        );
      }
      return true;
    }),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .isLength({ min: 8, max: 20 })
    .withMessage('Please enter a valid phone number'),

  body('district')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('District name cannot exceed 100 characters'),

  body('state')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('State name cannot exceed 100 characters'),

  // Optional fields for agricultural experts
  body('expertLicenseNumber')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 50 })
    .withMessage('License number cannot exceed 50 characters'),

  body('expertSpecialization')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Specialization cannot exceed 100 characters'),
];

/**
 * Route-level validation chain for User Login
 */
const loginValidationRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

module.exports = {
  validate,
  registerValidationRules,
  loginValidationRules,
};

