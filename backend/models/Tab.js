const mongoose = require('mongoose');

const TabSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: 'default_user'
  },
  tabData: [{
    tabId: Number,
    title: String,
    url: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  suggestions: [{
    tabId: Number,
    reason: String,
    confidence: Number,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Tab', TabSchema);