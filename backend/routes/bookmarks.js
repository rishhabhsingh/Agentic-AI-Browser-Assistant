const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmarkController');

// POST /api/bookmarks/add - Add bookmark
router.post('/add', bookmarkController.addBookmark);

// GET /api/bookmarks/list - Get all bookmarks
router.get('/list', bookmarkController.listBookmarks);

// POST /api/bookmarks/search - Smart search
router.post('/search', bookmarkController.searchBookmarks);

// DELETE /api/bookmarks/:id - Delete bookmark
router.delete('/:id', bookmarkController.deleteBookmark);

module.exports = router;