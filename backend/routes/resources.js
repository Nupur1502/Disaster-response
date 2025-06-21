const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');

// ✅ GET /api/resources?lat=...&lng=...
router.get('/', async (req, res) => {
  const { lat, lng, distance = 10000 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'lat and lng are required' });
  }

  const { data, error } = await supabase.rpc('get_nearby_resources', {
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    dist: parseFloat(distance),
  });

  if (error) {
    console.error('Supabase RPC error: ', error.message);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

module.exports = router;



