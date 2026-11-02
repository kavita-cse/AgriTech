const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Farmer ID is required'],
      index: true,
    },
    farmerName: {
      type: String,
      required: true,
    },
    expertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    expertName: {
      type: String,
      default: '',
    },
    cropId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop',
      default: null,
    },
    cropName: {
      type: String,
      default: '',
    },
    querySubject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    queryDescription: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    attachedImageUrl: {
      type: String,
      default: '',
    },
    expertResponse: {
      type: String,
      default: '',
      maxlength: [4000, 'Response cannot exceed 4000 characters'],
    },
    status: {
      type: String,
      required: true,
      enum: ['open', 'assigned', 'answered', 'closed'],
      default: 'open',
      index: true,
    },
    answeredAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Consultation = mongoose.model('Consultation', consultationSchema);

module.exports = Consultation;

