const { getWeatherData } = require('../services/weatherService');
const Farm = require('../models/Farm');

/**
 * @route   GET /api/weather
 * @desc    Get regional micro-climate data and agricultural advisories
 * @access  Protected (Authenticated users)
 */
const getWeather = async (req, res, next) => {
  try {
    let district = req.query.district;
    let state = req.query.state || req.user?.state || 'Maharashtra';

    // If farmId is supplied, lookup that farm's district
    if (req.query.farmId) {
      const farm = await Farm.findById(req.query.farmId);
      if (farm && farm.district) {
        district = farm.district;
        state = farm.state || state;
      }
    }

    if (!district) {
      district = req.user?.district || 'Nashik';
    }

    const weather = await getWeatherData(district, state);

    res.status(200).json({
      status: 'success',
      weather,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWeather,
};

