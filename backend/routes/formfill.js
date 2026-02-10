const express = require('express');
const router = express.Router();
const formFillController = require('../controllers/formFillController');

// POST /api/formfill/save-profile - Save user profile
router.post('/save-profile', formFillController.saveProfile);

// GET /api/formfill/get-profile - Get user profile
router.get('/get-profile', formFillController.getProfile);

// POST /api/formfill/match-fields - Match form fields to user data
router.post('/match-fields', formFillController.matchFields);

module.exports = router;