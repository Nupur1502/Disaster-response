const express = require('express');
const router = express.Router();
const { setCache, getCache } = require('../utils/cache');

// ✅ GET /api/disasters/:disasterId/official-updates
router.get('/:disasterId/official-updates', async (req, res) => {
  const { disasterId } = req.params;
  const cacheKey = `updates-${disasterId}`;

  try {
    const cached = await getCache(cacheKey);
    if (cached) {
      console.log(`[CACHE HIT] ${cacheKey}`);
      return res.json(cached);
    }

    // 📰 Dummy data simulating Browse Page scraped content
    const updates = [
      { source: 'FEMA', update: 'Relief operations started in affected area' },
      { source: 'Red Cross', update: 'Medical aid being provided' }
    ];

    // 💾 Cache for 1 hour (handled internally in setCache)
    await setCache(cacheKey, updates);

    console.log(`[CACHE MISS] ${cacheKey} — stored fresh data.`);
    res.json(updates);
  } catch (err) {
    console.error('Error fetching official updates:', err.message);
    res.status(500).json({ error: 'Failed to get official updates' });
  }
});

module.exports = router;


