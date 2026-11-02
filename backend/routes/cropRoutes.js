const express = require('express');
const router = express.Router();
const Crop = require('../models/Crop');
const {
  createCrop,
  getCrops,
  getCropById,
  updateCrop,
  deleteCrop,
} = require('../controllers/cropController');
const { authenticateToken, authorizeRoles, checkOwnership } = require('../middleware/auth');

router.use(authenticateToken);

router.post('/', authorizeRoles('farmer', 'admin'), createCrop);
router.get('/', getCrops);
router.get('/:id', checkOwnership(Crop), getCropById);
router.put('/:id', checkOwnership(Crop), updateCrop);
router.delete('/:id', checkOwnership(Crop), deleteCrop);

module.exports = router;

