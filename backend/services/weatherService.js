/**
 * AgriTech Weather Service
 *
 * Implements Live vs. Demo policy per Architecture Version 2.3 (Section 3.4).
 * Returns real OpenWeatherMap data when OPENWEATHER_API_KEY is configured;
 * otherwise gracefully falls back to clearly labelled, realistic demo data.
 */

const getWeatherData = async (district = 'Nashik', state = 'Maharashtra') => {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (apiKey && apiKey !== 'your_openweather_api_key_here') {
    try {
      const query = encodeURIComponent(`${district},IN`);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${apiKey}`
      );

      if (response.ok) {
        const data = await response.json();
        const temp = Math.round(data.main.temp);
        const humidity = data.main.humidity;
        const windSpeed = Math.round((data.wind.speed || 0) * 3.6); // m/s to km/h
        const condition = data.weather?.[0]?.description || 'Clear';

        let advisory = 'Normal weather conditions for scheduled field operations.';
        if (humidity > 80) advisory = 'High humidity: monitor crops for early fungal spore development.';
        if (temp > 36) advisory = 'High temperature alert: schedule irrigation during cooler early hours to prevent heat stress.';
        if (windSpeed > 25) advisory = 'High wind speeds: postpone drone or foliar chemical spraying.';

        return {
          isLive: true,
          badgeLabel: 'Live Weather — Powered by OpenWeatherMap',
          location: `${district}, ${state}`,
          temperature: `${temp}°C`,
          tempNum: temp,
          condition: condition.charAt(0).toUpperCase() + condition.slice(1),
          humidity: `${humidity}%`,
          humidityNum: humidity,
          windSpeed: `${windSpeed} km/h`,
          rainProbability: data.rain ? '75%' : '15%',
          advisory,
          lastUpdated: new Date().toLocaleTimeString(),
        };
      }
    } catch (err) {
      console.warn('OpenWeatherMap API request failed, falling back to labelled demo data:', err.message);
    }
  }

  // Graceful, clearly-labelled DEMO Fallback per Architecture Version 2.3
  return {
    isLive: false,
    badgeLabel: '⚠️ DEMO DATA: Live weather is currently unavailable. Do not base planting decisions on this data.',
    location: `${district}, ${state} (Simulated Demo Region)`,
    temperature: '28°C',
    tempNum: 28,
    condition: 'Partly Cloudy with Light Breeze',
    humidity: '54%',
    humidityNum: 54,
    windSpeed: '12 km/h (North-East)',
    rainProbability: '15%',
    advisory:
      'Favorable weather window for routine foliar bio-stimulant spraying between 07:00 AM and 10:30 AM. Light humidity expected to rise tomorrow evening.',
    forecastDays: [
      { day: 'Today', icon: 'bi-sun-fill', temp: '29°C / 18°C', rain: '15%', condition: 'Partly Cloudy' },
      { day: 'Tomorrow', icon: 'bi-cloud-sun-fill', temp: '28°C / 19°C', rain: '25%', condition: 'Scattered Clouds' },
      { day: 'Wednesday', icon: 'bi-cloud-rain-fill', temp: '26°C / 17°C', rain: '60%', condition: 'Light Showers' },
      { day: 'Thursday', icon: 'bi-sun-fill', temp: '30°C / 18°C', rain: '10%', condition: 'Clear Sky' },
    ],
    lastUpdated: 'Simulated Demo Feed',
  };
};

module.exports = {
  getWeatherData,
};

