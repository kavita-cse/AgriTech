const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema(
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
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
      maxlength: [100, 'Crop name cannot exceed 100 characters'],
    },
    variety: {
      type: String,
      trim: true,
      default: 'Standard Certified',
    },
    sowingDate: {
      type: Date,
      required: [true, 'Sowing date is required'],
    },
    expectedHarvestDate: {
      type: Date,
    },
    currentStage: {
      type: String,
      required: [true, 'Current growth stage is required'],
      enum: ['sowing', 'vegetative', 'flowering', 'harvesting'],
      default: 'vegetative',
    },
    status: {
      type: String,
      required: [true, 'Crop status is required'],
      enum: ['active', 'harvested', 'failed'],
      default: 'active',
    },
    progressPercent: {
      type: Number,
      min: 0,
      max: 100,
      default: 25,
    },
    waterRequirement: {
      type: String,
      trim: true,
      default: 'Standard drip schedule',
    },
  },
  {
    timestamps: true,
  }
);

// Auto-calculate default expected harvest date (approx 120 days from sowing) if omitted
cropSchema.pre('save', function () {
  if (!this.expectedHarvestDate && this.sowingDate) {
    const harvest = new Date(this.sowingDate);
    harvest.setDate(harvest.getDate() + 120);
    this.expectedHarvestDate = harvest;
  }
});

const Crop = mongoose.model('Crop', cropSchema);

module.exports = Crop;

