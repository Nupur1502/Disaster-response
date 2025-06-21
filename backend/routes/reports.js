const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');

// ✅ Submit a new report
router.post('/', async (req, res) => {
  const { disaster_id, user_id, content, image_url } = req.body;

  try {
    if (!disaster_id || typeof disaster_id !== 'string' || disaster_id.length !== 36) {
      return res.status(400).json({ error: 'Invalid disaster_id format' });
    }

    const { data, error } = await supabase
      .from('reports')
      .insert([
        {
          disaster_id,
          user_id,
          content,
          image_url,
          verification_status: 'pending',
        },
      ])
      .select();

    if (error) {
      console.error('Insert report error:', error.message);
      return res.status(500).json({ error: error.message });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('report_added', {
        type: 'created',
        data: data[0],
      });
    }

    console.log(`[${new Date().toISOString()}] [INFO] Report submitted for disaster_id=${disaster_id} by user=${user_id}`);
    res.status(201).json(data[0]);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ error: 'Something went wrong submitting report.' });
  }
});

// ✅ Fetch reports for a given disaster
router.get('/:id/reports', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('disaster_id', id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch reports error:', error.message);
    return res.status(500).json({ error: error.message });
  }

  console.log(`[${new Date().toISOString()}] [INFO] Fetched ${data.length} reports for disaster_id=${id}`);
  res.json(data);
});

module.exports = router;