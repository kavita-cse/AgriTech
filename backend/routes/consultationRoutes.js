const express = require('express');
const router = express.Router();
const {
  createConsultation,
  getMyConsultations,
  getOpenConsultations,
  respondToConsultation,
} = require('../controllers/consultationController');
const {
  authenticateToken,
  authorizeRoles,
  requireVerifiedExpert,
} = require('../middleware/auth');

router.use(authenticateToken);

// Farmer submits consultation
router.post('/', authorizeRoles('farmer', 'admin'), createConsultation);

// Get my tickets
router.get('/my', getMyConsultations);

// Verified expert views open queue
router.get('/open', requireVerifiedExpert, getOpenConsultations);

// Verified expert responds to ticket
router.put('/:id/respond', requireVerifiedExpert, respondToConsultation);

module.exports = router;
