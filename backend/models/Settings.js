const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    default: 'default_user'
  },
  preferences: {
    // General
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'dark'
    },
    fontSize: {
      type: Number,
      default: 16,
      min: 12,
      max: 24
    },
    
    // Features
    autoCleanTabs: {
      type: Boolean,
      default: false
    },
    showQuickActions: {
      type: Boolean,
      default: true
    },
    enableKeyboardShortcuts: {
      type: Boolean,
      default: true
    },
    
    // AI Settings
    defaultSimplificationLevel: {
      type: String,
      enum: ['eli5', 'simple', 'medium', 'technical'],
      default: 'simple'
    },
    aiProvider: {
      type: String,
      enum: ['groq', 'openai'],
      default: 'groq'
    },
    
    // Privacy
    saveHistory: {
      type: Boolean,
      default: true
    },
    enableAnalytics: {
      type: Boolean,
      default: false
    }
  },
  
  shortcuts: {
    openExtension: {
      type: String,
      default: 'Alt+B'
    },
    fillForm: {
      type: String,
      default: 'Alt+F'
    },
    simplifyText: {
      type: String,
      default: 'Alt+S'
    },
    readingMode: {
      type: String,
      default: 'Alt+R'
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);