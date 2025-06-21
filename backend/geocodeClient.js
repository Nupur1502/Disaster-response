// geocodeClient.js
const axios = require('axios');

async function geocodeLocation(locationName) {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: locationName,
        format: 'json',
        limit: 1,
      },
      headers: {
        'User-Agent': 'DisasterResponseApp/1.0' // Nominatim requires a valid User-Agent
      }
    });

    if (response.data.length === 0) {
      return null;
    }

    const { lat, lon } = response.data[0];
    return {
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
    };
  } catch (error) {
    console.error('Geocoding error:', error.message);
    return null;
  }
}

module.exports = geocodeLocation;
