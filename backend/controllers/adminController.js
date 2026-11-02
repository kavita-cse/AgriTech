const User = require('../models/User');
const Farm = require('../models/Farm');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Consultation = require('../models/Consultation');
const ForumPost = require('../models/ForumPost');

/**
 * @route   GET /api/admin/metrics
 * @desc    Get aggregate platform metrics
 * @access  Protected (Admin only)
 */
const getMetrics = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalFarms,
      totalProducts,
      totalOrders,
      openConsultations,
      totalForumPosts,
      pendingExperts,
    ] = await Promise.all([
      User.countDocuments(),
      Farm.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Consultation.countDocuments({ status: 'open' }),
      ForumPost.countDocuments(),
      User.countDocuments({ role: 'expert', expertVerificationStatus: 'pending' }),
    ]);

    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      status: 'success',
      metrics: {
        totalUsers,
        totalFarms,
        totalProducts,
        totalOrders,
        openConsultations,
        totalForumPosts,
        pendingExperts,
        usersByRole,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/users
 * @desc    List all platform users with role and status filtering
 * @access  Protected (Admin only)
 */
const getUsers = async (req, res, next) => {
  try {
    const { role, verificationStatus } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (verificationStatus) filter.expertVerificationStatus = verificationStatus;

    const users = await User.find(filter).select('-passwordHash').sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/admin/users/:id/status
 * @desc    Activate or deactivate a user account
 * @access  Protected (Admin only)
 */
const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ status: 'error', message: 'isActive must be a boolean.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found.' });
    }

    user.isActive = isActive;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: `User ${user.email} status updated to ${isActive ? 'active' : 'deactivated'}.`,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/admin/experts/:id/verify
 * @desc    Approve or reject agricultural expert verification
 * @access  Protected (Admin only)
 */
const verifyExpert = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: "Status must be either 'verified' or 'rejected'.",
      });
    }

    const expert = await User.findById(req.params.id);
    if (!expert || expert.role !== 'expert') {
      return res.status(404).json({ status: 'error', message: 'Agricultural expert account not found.' });
    }

    expert.expertVerificationStatus = status;
    await expert.save();

    res.status(200).json({
      status: 'success',
      message: `Expert ${expert.name} verification status set to '${status}'.`,
      expert: expert.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMetrics,
  getUsers,
  updateUserStatus,
  verifyExpert,
};
