import { useState, useEffect } from 'react';
import './Settings.css';

const API_URL = 'http://localhost:5000/api';

function Settings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch(`${API_URL}/settings?userId=default_user`);
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'default_user',
          preferences: settings.preferences,
          shortcuts: settings.shortcuts
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Settings saved successfully!');
      } else {
        alert('Failed to save settings');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving settings!');
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (key, value) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="settings">
        <div className="settings-header">
          <h2>⚙️ Settings</h2>
        </div>
        <div className="loading">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="settings">
      <div className="settings-header">
        <h2>⚙️ Settings</h2>
        <p className="settings-subtitle">Customize your BrowserBuddy</p>
      </div>

      <div className="settings-content">
        {/* General Settings */}
        <div className="settings-section">
          <h3>🎨 Appearance</h3>
          
          <div className="setting-item">
            <label>Theme</label>
            <select
              value={settings.preferences.theme}
              onChange={(e) => updatePreference('theme', e.target.value)}
            >
              <option value="auto">Auto (System)</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div className="setting-item">
            <label>Font Size</label>
            <div className="slider-container">
              <input
                type="range"
                min="12"
                max="24"
                value={settings.preferences.fontSize}
                onChange={(e) => updatePreference('fontSize', parseInt(e.target.value))}
              />
              <span>{settings.preferences.fontSize}px</span>
            </div>
          </div>
        </div>

        {/* Feature Settings */}
        <div className="settings-section">
          <h3>🚀 Features</h3>
          
          <div className="setting-item toggle">
            <label>
              <span>Auto Clean Tabs</span>
              <small>Automatically suggest cleaning duplicate tabs</small>
            </label>
            <input
              type="checkbox"
              checked={settings.preferences.autoCleanTabs}
              onChange={(e) => updatePreference('autoCleanTabs', e.target.checked)}
            />
          </div>

          <div className="setting-item toggle">
            <label>
              <span>Show Quick Actions</span>
              <small>Display quick action buttons</small>
            </label>
            <input
              type="checkbox"
              checked={settings.preferences.showQuickActions}
              onChange={(e) => updatePreference('showQuickActions', e.target.checked)}
            />
          </div>

          <div className="setting-item toggle">
            <label>
              <span>Keyboard Shortcuts</span>
              <small>Enable keyboard shortcuts</small>
            </label>
            <input
              type="checkbox"
              checked={settings.preferences.enableKeyboardShortcuts}
              onChange={(e) => updatePreference('enableKeyboardShortcuts', e.target.checked)}
            />
          </div>
        </div>

        {/* AI Settings */}
        <div className="settings-section">
          <h3>🤖 AI Settings</h3>
          
          <div className="setting-item">
            <label>Default Simplification Level</label>
            <select
              value={settings.preferences.defaultSimplificationLevel}
              onChange={(e) => updatePreference('defaultSimplificationLevel', e.target.value)}
            >
              <option value="eli5">ELI5 (Explain Like I'm 5)</option>
              <option value="simple">Simple</option>
              <option value="medium">Medium</option>
              <option value="technical">Technical</option>
            </select>
          </div>

          <div className="setting-item">
            <label>AI Provider</label>
            <select
              value={settings.preferences.aiProvider}
              onChange={(e) => updatePreference('aiProvider', e.target.value)}
            >
              <option value="groq">Groq (Free & Fast)</option>
              <option value="openai">OpenAI</option>
            </select>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="settings-section">
          <h3>🔒 Privacy</h3>
          
          <div className="setting-item toggle">
            <label>
              <span>Save History</span>
              <small>Store your browsing and analysis history</small>
            </label>
            <input
              type="checkbox"
              checked={settings.preferences.saveHistory}
              onChange={(e) => updatePreference('saveHistory', e.target.checked)}
            />
          </div>

          <div className="setting-item toggle">
            <label>
              <span>Enable Analytics</span>
              <small>Help improve BrowserBuddy (anonymous)</small>
            </label>
            <input
              type="checkbox"
              checked={settings.preferences.enableAnalytics}
              onChange={(e) => updatePreference('enableAnalytics', e.target.checked)}
            />
          </div>
        </div>

        {/* About */}
        <div className="settings-section">
          <h3>ℹ️ About</h3>
          <div className="about-info">
            <p><strong>BrowserBuddy AI</strong></p>
            <p>Version: 1.0.0</p>
            <p>Built with ❤️ for College Project</p>
            <p>Powered by Groq AI</p>
          </div>
        </div>

        {/* Save Button */}
        <div className="settings-footer">
          <button 
            className="save-settings-btn"
            onClick={saveSettings}
            disabled={saving}
          >
            {saving ? '💾 Saving...' : '💾 Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;