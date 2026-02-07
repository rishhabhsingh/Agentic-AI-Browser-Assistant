const express = require('express');
const router = express.Router();
const tabController = require('../controllers/tabController');

// TEST ROUTE
router.get('/', (req, res) => {
  res.json({ message: 'Tabs API is working' });
});

// ANALYZE
router.post('/analyze', tabController.analyzeTabs);

// STATS
router.post('/stats', tabController.getTabStats);

// HISTORY
router.get('/history', tabController.getHistory);

module.exports = router;
