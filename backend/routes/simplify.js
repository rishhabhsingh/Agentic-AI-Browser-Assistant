const express = require('express');
const router = express.Router();
const simplifyController = require('../controllers/simplifyController');

router.post('/text', simplifyController.simplifyText);
router.post('/page', simplifyController.simplifyPage);

module.exports = router;