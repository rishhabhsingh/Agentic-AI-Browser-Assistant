const express = require('express');
const router = express.Router();
const youtubeController = require('../controllers/youtubeController');

// POST /api/youtube/analyze - Get transcript and summary
router.post('/analyze', youtubeController.analyzeVideo);

module.exports = router;