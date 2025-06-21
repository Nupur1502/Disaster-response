// routes/socialMedia.js
const express = require('express');
const router = express.Router();
const { fetchMockTweets } = require('../mockTwitterClient');

// GET /api/disasters/:id/social-media
router.get('/:id/social-media', (req, res) => {
  const { id } = req.params;

  const tweets = fetchMockTweets(id);

  // Optional: WebSocket emit
  const io = req.app.get('io');
  if (io) {
    io.emit('social_media_updated', {
      type: 'fetched',
      disaster_id: id,
      data: tweets,
    });
  }

  res.json(tweets);
});

module.exports = router;


