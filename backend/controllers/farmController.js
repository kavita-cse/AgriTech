const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const SoilRecord = require('../models/SoilRecord');

/**
 * @route   POST /api/farms
 * @desc    Create a new farm plot for the authenticated farmer
 * @access  Protected (Farmer only)
 */
const createFarm = async (req, res, next) => {
  try {
    const {
      farmName,
      totalArea,
      areaUnit,
      soilType,
      irrigationType,
      surveyNumber,
      district,
      state,
      mainCrop,
      notes,
    } = req.body;

    if (!farmName || !totalArea) {
      return res.status(400).json({
        status: 'error',
        message: 'Farm name and total area are required.',
      });
    }

    const normalizeSoilType = (type) => {
      if (!type) return 'black';
      const s = type.toLowerCase();
      if (s.includes('alluvial')) return 'alluvial';
      if (s.includes('black')) return 'black';
      if (s.includes('red')) return 'red';
      if (s.includes('clay')) return 'clay';
      if (s.includes('sandy')) return 'sandy';
      if (s.includes('loam')) return 'loam';
      return 'other';
    };

    const normalizeIrrigationType = (type) => {
      if (!type) return 'drip';
      const i = type.toLowerCase();
      if (i.includes('drip')) return 'drip';
      if (i.includes('sprinkler')) return 'sprinkler';
      if (i.includes('rain')) return 'rain-fed';
      if (i.includes('canal')) return 'canal';
      if (i.includes('borewell')) return 'borewell';
      return 'surface';
    };

    const farm = new Farm({
      farmerId: req.user._id,
      farmName: farmName.trim(),
      totalArea: Number(totalArea),
      areaUnit: areaUnit || 'acres',
      soilType: normalizeSoilType(soilType),
      irrigationType: normalizeIrrigationType(irrigationType),
      surveyNumber: surveyNumber?.trim() || 'Pending Survey Verification',
      district: district?.trim() || req.user.district || 'Nashik',
      state: state?.trim() || req.user.state || 'Maharashtra',
      mainCrop: mainCrop?.trim() || 'Mixed Crops',
      notes: notes?.trim() || '',
    });

    await farm.save();

    res.status(201).json({
      status: 'success',
      message: 'Agricultural plot registered successfully.',
      farm,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/farms
 * @desc    Get all farms owned by the authenticated farmer
 * @access  Protected
 */
const getFarms = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { farmerId: req.user._id };
    const farms = await Farm.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: farms.length,
      farms,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/farms/:id
 * @desc    Get details of a specific farm
 * @access  Protected (Owner or Admin)
 */
const getFarmById = async (req, res) => {
  res.status(200).json({
    status: 'success',
    farm: req.resource,
  });
};

/**
 * @route   PUT /api/farms/:id
 * @desc    Update an existing farm
 * @access  Protected (Owner or Admin)
 */
const updateFarm = async (req, res, next) => {
  try {
    const allowedUpdates = [
      'farmName',
      'totalArea',
      'areaUnit',
      'soilType',
      'irrigationType',
      'surveyNumber',
      'district',
      'state',
      'mainCrop',
      'notes',
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        req.resource[field] = req.body[field];
      }
    });

    await req.resource.save();

    res.status(200).json({
      status: 'success',
      message: 'Farm updated successfully.',
      farm: req.resource,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/farms/:id
 * @desc    Delete a farm and its associated crops/soil records
 * @access  Protected (Owner or Admin)
 */
const deleteFarm = async (req, res, next) => {
  try {
    const farmId = req.resource._id;

    // Delete associated crops and soil records
    await Crop.deleteMany({ farmId });
    await SoilRecord.deleteMany({ farmId });
    await Farm.findByIdAndDelete(farmId);

    res.status(200).json({
      status: 'success',
      message: 'Farm and associated records deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFarm,
  getFarms,
  getFarmById,
  updateFarm,
  deleteFarm,
};
