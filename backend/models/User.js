const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email address',
      ],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false, // Do not return passwordHash in queries by default
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: {
        values: ['farmer', 'expert', 'vendor', 'buyer', 'admin'],
        message: '{VALUE} is not a valid AgriTech role',
      },
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
      default: 'Nashik',
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
      default: 'Maharashtra',
    },
    expertLicenseNumber: {
      type: String,
      trim: true,
      default: undefined,
    },
    expertSpecialization: {
      type: String,
      trim: true,
      default: undefined,
    },
    expertVerificationStatus: {
      type: String,
      required: true,
      enum: {
        values: ['none', 'pending', 'verified', 'rejected'],
        message: '{VALUE} is not a valid verification status',
      },
      default: function () {
        return this.role === 'expert' ? 'pending' : 'none';
      },
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for password input
userSchema.virtual('password').set(function (password) {
  this._password = password;
});

// Pre-save hook: Hash password with bcrypt before saving if provided
userSchema.pre('save', async function () {
  if (this._password) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this._password, salt);
    this._password = undefined;
  }
});

// Instance method: Explicitly set and hash password
userSchema.methods.setPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(password, salt);
};

// Instance method: Compare password candidate with stored hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.passwordHash) {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Instance method: Generate signed JWT
userSchema.methods.generateAuthToken = function () {
  const payload = {
    userId: this._id,
    role: this.role,
    expertVerificationStatus: this.expertVerificationStatus,
  };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured in environment variables.');
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(payload, secret, { expiresIn });
};

// Sanitize user object: Ensure passwordHash and internal fields are never exposed
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});

userSchema.set('toObject', {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

