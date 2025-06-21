const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');
const geocodeLocation = require('../geocodeClient');

// ✅ Dummy fallback
router.get('/dummy', (req, res) => {
  res.json([{ id: 1, type: 'Earthquake', location: 'Delhi' }]);
});

// ✅ Get all disasters
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('disasters').select('*');

  if (error) {
    console.error('Supabase error:', error.message);
    return res.status(500).json({ error: error.message });
  }

  console.log(`[${new Date().toISOString()}] [INFO] Fetched ${data.length} disasters`);
  res.json(data);
});

// ✅ Create a new disaster
router.post('/', async (req, res) => {
  const { title, location_name, description, tags, owner_id } = req.body;

  try {
    const coords = await geocodeLocation(location_name);

    if (!coords) {
      return res.status(400).json({ error: 'Failed to geocode location name.' });
    }

    const point = `POINT(${coords.longitude} ${coords.latitude})`;

    const { data, error } = await supabase
      .from('disasters')
      .insert([{
        title,
        location_name,
        description,
        tags,
        owner_id,
        location: point
      }])
      .select();

    if (error) {
      console.error('Supabase insert error:', error.message);
      return res.status(500).json({ error: error.message });
    }

    const io = req.app.get('io');
    io.emit('disaster_updated', {
      type: 'created',
      data: data[0],
    });

    console.log(`[${new Date().toISOString()}] [INFO] Disaster created: ${title} at ${location_name}`);
    res.status(201).json(data[0]);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ error: 'Something went wrong creating disaster.' });
  }
});

// ✅ Update disaster by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, location_name, description, tags, owner_id } = req.body;

  try {
    const coords = await geocodeLocation(location_name);
    const point = `POINT(${coords.longitude} ${coords.latitude})`;

    const { data, error } = await supabase
      .from('disasters')
      .update({
        title,
        location_name,
        description,
        tags,
        location: point,
        audit_trail: {
          action: 'update',
          user_id: owner_id,
          timestamp: new Date().toISOString(),
        },
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase update error:', error.message);
      return res.status(500).json({ error: error.message });
    }

    const io = req.app.get('io');
    io.emit('disaster_updated', { type: 'updated', data: data[0] });

    console.log(`[${new Date().toISOString()}] [INFO] Disaster updated: ${id} (${title})`);
    res.json(data[0]);
  } catch (err) {
    console.error('Update error:', err.message);
    res.status(500).json({ error: 'Failed to update disaster.' });
  }
});

// ✅ Delete disaster by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('disasters')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase delete error:', error.message);
      return res.status(500).json({ error: error.message });
    }

    const io = req.app.get('io');
    io.emit('disaster_updated', { type: 'deleted', data: { id } });

    console.log(`[${new Date().toISOString()}] [INFO] Disaster deleted: ${id}`);
    res.json({ success: true, deleted: data });
  } catch (err) {
    console.error('Delete error:', err.message);
    res.status(500).json({ error: 'Failed to delete disaster.' });
  }
});

module.exports = router;