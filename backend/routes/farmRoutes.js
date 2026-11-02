const express = require('express');
const router = express.Router();
const Farm = require('../models/Farm');
const {
  createFarm,
  getFarms,
  getFarmById,
  updateFarm,
  deleteFarm,
} = require('../controllers/farmController');
const { authenticateToken, authorizeRoles, checkOwnership } = require('../middleware/auth');

// All farm routes require authentication
router.use(authenticateToken);

router.post('/', authorizeRoles('farmer', 'admin'), createFarm);
router.get('/', getFarms);
router.get('/:id', checkOwnership(Farm), getFarmById);
router.put('/:id', checkOwnership(Farm), updateFarm);
router.delete('/:id', checkOwnership(Farm), deleteFarm);

module.exports = router;
