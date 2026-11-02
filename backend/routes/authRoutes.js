const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getMe,
} = require('../controllers/authController');

const {
  validate,
  registerValidationRules,
  loginValidationRules,
} = require('../middleware/validator');

const { authenticateToken } = require('../middleware/auth');

/**
 * @route   POST /api/auth/register
 * @desc    Public Registration with route-level validation
 * @access  Public
 */
router.post('/register', registerValidationRules, validate, register);

/**
 * @route   POST /api/auth/login
 * @desc    Public User Login with route-level validation
 * @access  Public
 */
router.post('/login', loginValidationRules, validate, login);

/**
 * @route   GET /api/auth/me
 * @desc    Get Authenticated User Profile
 * @access  Protected (Requires Bearer token)
 */
router.get('/me', authenticateToken, getMe);

module.exports = router;

