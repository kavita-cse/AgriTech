const express = require('express');
const router = express.Router();
const {
  getMetrics,
  getUsers,
  updateUserStatus,
  verifyExpert,
} = require('../controllers/adminController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.use(authenticateToken);
router.use(authorizeRoles('admin'));

router.get('/metrics', getMetrics);
router.get('/users', getUsers);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/experts/:id/verify', verifyExpert);

module.exports = router;

