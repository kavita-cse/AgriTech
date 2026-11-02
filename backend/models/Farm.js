const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Farmer ID is required'],
      index: true,
    },
    farmName: {
      type: String,
      required: [true, 'Farm name is required'],
      trim: true,
      maxlength: [120, 'Farm name cannot exceed 120 characters'],
    },
    totalArea: {
      type: Number,
      required: [true, 'Total area is required'],
      min: [0.1, 'Farm area must be greater than zero'],
    },
    areaUnit: {
      type: String,
      required: [true, 'Area unit is required'],
      enum: ['acres', 'hectares'],
      default: 'acres',
    },
    soilType: {
      type: String,
      required: [true, 'Soil type is required'],
      enum: ['alluvial', 'black', 'red', 'clay', 'sandy', 'loam', 'other'],
      default: 'black',
    },
    irrigationType: {
      type: String,
      required: [true, 'Irrigation type is required'],
      enum: ['drip', 'sprinkler', 'rain-fed', 'canal', 'borewell', 'surface'],
      default: 'drip',
    },
    surveyNumber: {
      type: String,
      trim: true,
      default: 'Pending Survey Verification',
    },
    district: {
      type: String,
      required: [true, 'District is required for weather & regional advisories'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
      default: 'Maharashtra',
    },
    mainCrop: {
      type: String,
      trim: true,
      default: 'Mixed Crops',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Farm = mongoose.model('Farm', farmSchema);

module.exports = Farm;
