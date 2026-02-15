const Settings = require('../models/Settings');
const mongoose = require('mongoose'); // ADD THIS

// Get settings
exports.getSettings = async (req, res) => {
  try {
    const { userId = 'default_user' } = req.query;

    console.log('⚙️ Getting settings for:', userId);

    let settings = await Settings.findOne({ userId });

    // Create default if not exists
    if (!settings) {
      settings = new Settings({ 
        userId,
        preferences: {
          theme: 'dark',
          fontSize: 16,
          autoCleanTabs: false,
          showQuickActions: true,
          enableKeyboardShortcuts: true,
          defaultSimplificationLevel: 'simple',
          aiProvider: 'groq',
          saveHistory: true,
          enableAnalytics: false
        },
        shortcuts: {
          openExtension: 'Alt+B',
          fillForm: 'Alt+F',
          simplifyText: 'Alt+S',
          readingMode: 'Alt+R'
        }
      });
      await settings.save();
      console.log('✅ Created default settings');
    }

    res.json({
      success: true,
      settings: settings
    });

  } catch (error) {
    console.error('❌ Error getting settings:', error);
    
    // If MongoDB is not connected, return defaults
    if (error.name === 'MongooseError' || !mongoose.connection.readyState) {
      console.log('📝 MongoDB not available, returning defaults');
      return res.json({
        success: true,
        settings: {
          userId: 'default_user',
          preferences: {
            theme: 'dark',
            fontSize: 16,
            autoCleanTabs: false,
            showQuickActions: true,
            enableKeyboardShortcuts: true,
            defaultSimplificationLevel: 'simple',
            aiProvider: 'groq',
            saveHistory: true,
            enableAnalytics: false
          },
          shortcuts: {
            openExtension: 'Alt+B',
            fillForm: 'Alt+F',
            simplifyText: 'Alt+S',
            readingMode: 'Alt+R'
          }
        }
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to get settings',
      error: error.message
    });
  }
};

// Save settings
exports.saveSettings = async (req, res) => {
  try {
    const { userId = 'default_user', preferences, shortcuts } = req.body;

    console.log('💾 Saving settings for:', userId);
    console.log('Preferences:', preferences);
    console.log('Shortcuts:', shortcuts);

    let settings = await Settings.findOne({ userId });

    if (settings) {
      // Update existing
      if (preferences) {
        settings.preferences = { ...settings.preferences, ...preferences };
      }
      if (shortcuts) {
        settings.shortcuts = { ...settings.shortcuts, ...shortcuts };
      }
      await settings.save();
    } else {
      // Create new
      settings = new Settings({
        userId,
        preferences: preferences || {},
        shortcuts: shortcuts || {}
      });
      await settings.save();
    }

    console.log('✅ Settings saved successfully');

    res.json({
      success: true,
      message: 'Settings saved successfully',
      settings: settings
    });

  } catch (error) {
    console.error('❌ Error saving settings:', error);
    
    // If MongoDB not available, just return success (can't persist)
    if (error.name === 'MongooseError' || !mongoose.connection.readyState) {
      console.log('📝 MongoDB not available, settings not persisted');
      return res.json({
        success: true,
        message: 'Settings saved (in-memory only - MongoDB not connected)',
        settings: {
          userId,
          preferences: preferences || {},
          shortcuts: shortcuts || {}
        }
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to save settings',
      error: error.message
    });
  }
};