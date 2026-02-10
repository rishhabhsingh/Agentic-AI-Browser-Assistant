const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: 'default_user'
  },
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  description: String,
  favicon: String,
  
  // AI-generated
  category: {
    type: String,
    default: 'Uncategorized'
  },
  tags: [String],
  summary: String,
  
  // Metadata
  dateAdded: {
    type: Date,
    default: Date.now
  },
  lastAccessed: Date,
  accessCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Index for search
BookmarkSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Bookmark', BookmarkSchema);