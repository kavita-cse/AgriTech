const Crop = require('../models/Crop');
const Farm = require('../models/Farm');

/**
 * @route   POST /api/crops
 * @desc    Create a new crop for a registered farm
 * @access  Protected (Farmer)
 */
const createCrop = async (req, res, next) => {
  try {
    const {
      farmId,
      cropName,
      variety,
      sowingDate,
      expectedHarvestDate,
      currentStage,
      status,
      progressPercent,
      waterRequirement,
    } = req.body;

    if (!farmId || !cropName || !sowingDate) {
      return res.status(400).json({
        status: 'error',
        message: 'Farm ID, crop name, and sowing date are required.',
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
        message: 'Access forbidden: You can only add crops to your own registered farms.',
      });
    }

    const crop = new Crop({
      farmId,
      farmerId: req.user._id,
      cropName: cropName.trim(),
      variety: variety?.trim() || 'Standard Certified',
      sowingDate: new Date(sowingDate),
      expectedHarvestDate: expectedHarvestDate ? new Date(expectedHarvestDate) : undefined,
      currentStage: currentStage || 'vegetative',
      status: status || 'active',
      progressPercent: progressPercent !== undefined ? Number(progressPercent) : 25,
      waterRequirement: waterRequirement?.trim() || 'Standard drip schedule',
    });

    await crop.save();

    res.status(201).json({
      status: 'success',
      message: 'Crop added for monitoring successfully.',
      crop,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/crops
 * @desc    Get all crops owned by the farmer (or filter by ?farmId=...)
 * @access  Protected
 */
const getCrops = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { farmerId: req.user._id };
    if (req.query.farmId) {
      filter.farmId = req.query.farmId;
    }

    const crops = await Crop.find(filter)
      .populate('farmId', 'farmName district totalArea')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: crops.length,
      crops,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/crops/:id
 * @desc    Get details of a specific crop
 * @access  Protected (Owner or Admin)
 */
const getCropById = async (req, res) => {
  res.status(200).json({
    status: 'success',
    crop: req.resource,
  });
};

/**
 * @route   PUT /api/crops/:id
 * @desc    Update crop stage, progress, or status
 * @access  Protected (Owner or Admin)
 */
const updateCrop = async (req, res, next) => {
  try {
    const allowed = [
      'cropName',
      'variety',
      'currentStage',
      'status',
      'progressPercent',
      'waterRequirement',
      'expectedHarvestDate',
    ];

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        req.resource[field] = req.body[field];
      }
    });

    await req.resource.save();

    res.status(200).json({
      status: 'success',
      message: 'Crop status updated successfully.',
      crop: req.resource,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/crops/:id
 * @desc    Delete a crop record
 * @access  Protected (Owner or Admin)
 */
const deleteCrop = async (req, res, next) => {
  try {
    await Crop.findByIdAndDelete(req.resource._id);
    res.status(200).json({
      status: 'success',
      message: 'Crop monitoring record deleted.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCrop,
  getCrops,
  getCropById,
  updateCrop,
  deleteCrop,
};

