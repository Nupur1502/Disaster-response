const axios = require('axios');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function listModels() {
  try {
    const res = await axios.get(`https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`);
    console.log('Available models:', res.data.models);
  } catch (err) {
    console.error('❌ Failed to fetch models:', err.response?.data || err.message);
  }
}

listModels();
