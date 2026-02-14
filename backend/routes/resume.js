const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');

// POST /api/resume/optimize - Optimize resume
router.post('/optimize', resumeController.optimizeResume);

// GET /api/resume/download/:filename - Download resume
router.get('/download/:filename', resumeController.downloadResume);

module.exports = router;