const mongoose = require('mongoose');

const MANDATORY_ADVISORY_DISCLAIMER =
  'These recommendations are indicative, rule-based advisories generated from configurable demo thresholds. They are for educational and preliminary planning purposes only and do not constitute a certified laboratory or agronomist diagnosis. Always consult a qualified local agronomist before applying chemical soil amendments.';

const soilRecordSchema = new mongoose.Schema(
  {
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farm',
      required: [true, 'Farm ID is required'],
      index: true,
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Farmer ID is required'],
      index: true,
    },
    testDate: {
      type: Date,
      required: [true, 'Test date is required'],
      default: Date.now,
    },
    phLevel: {
      type: Number,
      required: [true, 'pH level is required'],
      min: [0, 'pH cannot be lower than 0'],
      max: [14, 'pH cannot exceed 14'],
    },
    nitrogenKgPerHa: {
      type: Number,
      required: [true, 'Nitrogen value (kg/ha) is required'],
      min: [0, 'Nitrogen value must be non-negative'],
    },
    phosphorusKgPerHa: {
      type: Number,
      required: [true, 'Phosphorus value (kg/ha) is required'],
      min: [0, 'Phosphorus value must be non-negative'],
    },
    potassiumKgPerHa: {
      type: Number,
      required: [true, 'Potassium value (kg/ha) is required'],
      min: [0, 'Potassium value must be non-negative'],
    },
    organicCarbonPercent: {
      type: Number,
      min: [0, 'Organic Carbon % must be non-negative'],
      max: [100, 'Organic Carbon % cannot exceed 100'],
      default: 0.7,
    },
    recommendationSummary: {
      type: String,
      required: [true, 'Recommendation summary is required'],
      trim: true,
    },
    disclaimerText: {
      type: String,
      required: true,
      default: MANDATORY_ADVISORY_DISCLAIMER,
    },
  },
  {
    timestamps: true,
  }
);

const SoilRecord = mongoose.model('SoilRecord', soilRecordSchema);

module.exports = SoilRecord;
