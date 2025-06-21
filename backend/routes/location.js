// routes/location.js
const express = require('express');
const router = express.Router();
const { extractLocation } = require('../geminiClient');

router.post('/extract-location', async (req, res) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: 'Description is required.' });
  }

  try {
    const location = await extractLocation(description);
    res.json({ location });
  } catch (err) {
    console.error('Dummy extraction error:', err.message);
    res.status(500).json({ error: 'Failed to extract location.' });
  }
});

module.exports = router;



