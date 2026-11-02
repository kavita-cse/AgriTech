const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { connectDB } = require('../config/db');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await connectDB();

    const name = process.env.ADMIN_NAME || 'AgriTech System Admin';
    const email = (process.env.ADMIN_EMAIL || 'admin@agritech.com').toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD || 'AdminMaster2026!';

    let admin = await User.findOne({ email });

    if (admin) {
      console.log(`Admin account '${email}' already exists. Updating credentials and status...`);
      admin.name = name;
      admin.role = 'admin';
      admin.isActive = true;
      admin.expertVerificationStatus = 'none';
      await admin.setPassword(password);
      await admin.save();
      console.log(`✅ Admin account updated successfully! (ID: ${admin._id})`);
    } else {
      console.log(`Creating new Admin account '${email}'...`);
      admin = new User({
        name,
        email,
        role: 'admin',
        phone: '+91 9999999999',
        district: 'Admin Headquarters',
        state: 'Maharashtra',
        expertVerificationStatus: 'none',
        isActive: true,
      });
      await admin.setPassword(password);
      await admin.save();
      console.log(`✅ Admin account created successfully! (ID: ${admin._id})`);
    }

    await mongoose.disconnect();
    console.log('Database disconnected cleanly.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();

