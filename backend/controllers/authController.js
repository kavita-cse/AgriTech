const User = require('../models/User');

/**
 * @route   POST /api/auth/register
 * @desc    Public User Registration (farmer, expert, vendor, buyer)
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      district,
      state,
      expertLicenseNumber,
      expertSpecialization,
    } = req.body;

    // Check for existing user with identical email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'An account with this email address is already registered.',
      });
    }

    // Determine initial verification status based on role
    const expertVerificationStatus = role === 'expert' ? 'pending' : 'none';

    // Construct new user with explicit, allowlisted fields only
    const user = new User({
      name,
      email,
      role,
      phone,
      district: district?.trim() || 'Nashik',
      state: state?.trim() || 'Maharashtra',
      expertLicenseNumber: role === 'expert' ? expertLicenseNumber : undefined,
      expertSpecialization: role === 'expert' ? expertSpecialization : undefined,
      expertVerificationStatus,
      isActive: true,
    });

    // Hash password with bcrypt before saving
    await user.setPassword(password);
    await user.save();

    // Issue signed JWT token
    const token = user.generateAuthToken();

    res.status(201).json({
      status: 'success',
      message:
        role === 'expert'
          ? 'Registration successful. Expert account created and is pending admin verification.'
          : 'Registration successful. Welcome to AgriTech!',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate User & Issue JWT
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user with passwordHash explicitly selected for verification
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email address or password.',
      });
    }

    // Deactivation check before evaluating password
    if (!user.isActive) {
      return res.status(403).json({
        status: 'error',
        message: 'Account has been deactivated. Please contact support.',
      });
    }

    // Compare provided password with stored bcrypt hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email address or password.',
      });
    }

    // Issue signed JWT token
    const token = user.generateAuthToken();

    res.status(200).json({
      status: 'success',
      message: 'Login successful.',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get Current Authenticated User Profile
 * @access  Protected (Requires valid JWT and active account)
 */
const getMe = async (req, res) => {
  res.status(200).json({
    status: 'success',
    user: req.user.toJSON(),
  });
};

module.exports = {
  register,
  login,
  getMe,
};

