const Consultation = require('../models/Consultation');
const Crop = require('../models/Crop');

/**
 * @route   POST /api/consultations
 * @desc    Submit an expert consultation ticket
 * @access  Protected (Farmer)
 */
const createConsultation = async (req, res, next) => {
  try {
    const { querySubject, queryDescription, cropId, attachedImageUrl } = req.body;

    if (!querySubject || !queryDescription) {
      return res.status(400).json({
        status: 'error',
        message: 'Query subject and description are required.',
      });
    }

    let cropName = '';
    if (cropId) {
      const crop = await Crop.findById(cropId);
      if (crop) cropName = crop.cropName;
    }

    const consultation = new Consultation({
      farmerId: req.user._id,
      farmerName: req.user.name,
      cropId: cropId || null,
      cropName,
      querySubject: querySubject.trim(),
      queryDescription: queryDescription.trim(),
      attachedImageUrl: attachedImageUrl || '',
      status: 'open',
    });

    await consultation.save();

    res.status(201).json({
      status: 'success',
      message: 'Consultation ticket submitted successfully.',
      consultation,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/consultations/my
 * @desc    Get tickets submitted by the current farmer (or answered by expert)
 * @access  Protected
 */
const getMyConsultations = async (req, res, next) => {
  try {
    let filter = { farmerId: req.user._id };
    if (req.user.role === 'expert') {
      filter = { $or: [{ expertId: req.user._id }, { status: 'open' }] };
    } else if (req.user.role === 'admin') {
      filter = {};
    }

    const consultations = await Consultation.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: consultations.length,
      consultations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/consultations/open
 * @desc    Get all open tickets available for expert review
 * @access  Protected (Verified Expert or Admin)
 */
const getOpenConsultations = async (req, res, next) => {
  try {
    const openTickets = await Consultation.find({ status: 'open' }).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: openTickets.length,
      consultations: openTickets,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/consultations/:id/respond
 * @desc    Respond to a consultation query
 * @access  Protected (Verified Expert only - checks live DB status)
 */
const respondToConsultation = async (req, res, next) => {
  try {
    const { expertResponse } = req.body;

    if (!expertResponse || !expertResponse.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Expert response cannot be empty.',
      });
    }

    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({ status: 'error', message: 'Consultation ticket not found.' });
    }

    consultation.expertId = req.user._id;
    consultation.expertName = req.user.name;
    consultation.expertResponse = expertResponse.trim();
    consultation.status = 'answered';
    consultation.answeredAt = new Date();

    await consultation.save();

    res.status(200).json({
      status: 'success',
      message: 'Consultation answered successfully.',
      consultation,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createConsultation,
  getMyConsultations,
  getOpenConsultations,
  respondToConsultation,
};
