const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');

// GET /api/settings - Get user settings
router.get('/', settingsController.getSettings);

// POST /api/settings - Save user settings
router.post('/', settingsController.saveSettings);

module.exports = router;