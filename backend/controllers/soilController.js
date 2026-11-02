const SoilRecord = require('../models/SoilRecord');
const Farm = require('../models/Farm');
const { evaluateSoilHealth } = require('../services/soilRules');

/**
 * @route   POST /api/soil
 * @desc    Record soil test results and generate rule-based agronomic recommendations
 * @access  Protected (Farmer)
 */
const createSoilRecord = async (req, res, next) => {
  try {
    const {
      farmId,
      testDate,
      phLevel,
      nitrogenKgPerHa,
      phosphorusKgPerHa,
      potassiumKgPerHa,
      organicCarbonPercent,
    } = req.body;

    if (!farmId || phLevel === undefined || nitrogenKgPerHa === undefined || phosphorusKgPerHa === undefined || potassiumKgPerHa === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'Farm ID, pH level, Nitrogen, Phosphorus, and Potassium values are required.',
      });
    }

    // Verify farm ownership
    const farm = await Farm.findById(farmId);
    if (!farm) {
      return res.status(404).json({ status: 'error', message: 'Target farm plot not found.' });
    }

    if (farm.farmerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Access forbidden: You can only log soil records for your own registered farms.',
      });
    }

    // Run Server-side Rule Engine
    const evaluation = evaluateSoilHealth({
      phLevel: Number(phLevel),
      nitrogenKgPerHa: Number(nitrogenKgPerHa),
      phosphorusKgPerHa: Number(phosphorusKgPerHa),
      potassiumKgPerHa: Number(potassiumKgPerHa),
      organicCarbonPercent: organicCarbonPercent !== undefined ? Number(organicCarbonPercent) : 0.74,
    });

    const soilRecord = new SoilRecord({
      farmId,
      farmerId: req.user._id,
      testDate: testDate ? new Date(testDate) : new Date(),
      phLevel: Number(phLevel),
      nitrogenKgPerHa: Number(nitrogenKgPerHa),
      phosphorusKgPerHa: Number(phosphorusKgPerHa),
      potassiumKgPerHa: Number(potassiumKgPerHa),
      organicCarbonPercent: organicCarbonPercent !== undefined ? Number(organicCarbonPercent) : 0.74,
      recommendationSummary: evaluation.recommendationSummary,
      disclaimerText: evaluation.disclaimerText,
    });

    await soilRecord.save();

    res.status(201).json({
      status: 'success',
      message: 'Soil analysis record saved successfully.',
      soilRecord,
      evaluation,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/soil
 * @desc    Get soil test records for the farmer's farms
 * @access  Protected
 */
const getSoilRecords = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { farmerId: req.user._id };
    if (req.query.farmId) {
      filter.farmId = req.query.farmId;
    }

    const records = await SoilRecord.find(filter)
      .populate('farmId', 'farmName district totalArea')
      .sort({ testDate: -1, createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: records.length,
      records,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/soil/:id
 * @desc    Get a single soil record with full rule breakdown
 * @access  Protected (Owner or Admin)
 */
const getSoilRecordById = async (req, res) => {
  const evaluation = evaluateSoilHealth({
    phLevel: req.resource.phLevel,
    nitrogenKgPerHa: req.resource.nitrogenKgPerHa,
    phosphorusKgPerHa: req.resource.phosphorusKgPerHa,
    potassiumKgPerHa: req.resource.potassiumKgPerHa,
    organicCarbonPercent: req.resource.organicCarbonPercent,
  });

  res.status(200).json({
    status: 'success',
    soilRecord: req.resource,
    evaluation,
  });
};

module.exports = {
  createSoilRecord,
  getSoilRecords,
  getSoilRecordById,
};

