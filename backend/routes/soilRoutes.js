const express = require('express');
const router = express.Router();
const SoilRecord = require('../models/SoilRecord');
const {
  createSoilRecord,
  getSoilRecords,
  getSoilRecordById,
} = require('../controllers/soilController');
const { authenticateToken, authorizeRoles, checkOwnership } = require('../middleware/auth');

router.use(authenticateToken);

router.post('/', authorizeRoles('farmer', 'admin'), createSoilRecord);
router.get('/', getSoilRecords);
router.get('/:id', checkOwnership(SoilRecord), getSoilRecordById);

module.exports = router;
