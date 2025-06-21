// routes/verify.js

const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');
const { verifyImageWithGemini } = require('../geminiClient');

// POST /api/disasters/:id/verify-image
router.post('/:id/verify-image', async (req, res) => {
  const { id } = req.params;
  const { image_url } = req.body;

  if (!image_url) {
    return res.status(400).json({ error: 'Image URL is required' });
  }

  // 1. Run dummy Gemini check
  const verification_status = await verifyImageWithGemini(image_url);

  // 2. Update Supabase reports table where image_url matches
  const { data, error } = await supabase
    .from('reports')
    .update({ verification_status })
    .eq('image_url', image_url)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ verification_status, updated: data.length });
});

module.exports = router;

