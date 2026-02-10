const Settings = require('../models/Settings');

// Get settings
exports.getSettings = async (req, res) => {
  try {
    const { userId = 'default_user' } = req.query;

    console.log('⚙️ Getting settings for:', userId);

    let settings = await Settings.findOne({ userId });

    // Create default if not exists
    if (!settings) {
      settings = new Settings({ userId });
      await settings.save();
      console.log('✅ Created default settings');
    }

    res.json({
      success: true,
      settings: settings
    });

  } catch (error) {
    console.error('❌ Error getting settings:', error);
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

    let settings = await Settings.findOne({ userId });

    if (settings) {
      // Update existing
      if (preferences) settings.preferences = { ...settings.preferences, ...preferences };
      if (shortcuts) settings.shortcuts = { ...settings.shortcuts, ...shortcuts };
      await settings.save();
    } else {
      // Create new
      settings = new Settings({
        userId,
        preferences,
        shortcuts
      });
      await settings.save();
    }

    console.log('✅ Settings saved');

    res.json({
      success: true,
      message: 'Settings saved successfully',
      settings: settings
    });

  } catch (error) {
    console.error('❌ Error saving settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save settings',
      error: error.message
    });
  }
};