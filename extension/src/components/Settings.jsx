import { useState, useEffect } from 'react';
import './Settings.css';

const API_URL = 'https://browser-buddy-backend.onrender.com/api';

function Settings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/settings?userId=default_user`);
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.settings);
        console.log('Settings loaded:', data.settings);
        
        // Apply theme immediately
        applyTheme(data.settings.preferences.theme);
      } else {
        console.error('Failed to load settings:', data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      // Set defaults if backend fails
      setSettings({
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
      });
    } finally {
      setLoading(false);
    }
  };

  const applyTheme = (theme) => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.style.setProperty('--bg-gradient', 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)');
      root.style.setProperty('--text-color', '#ffffff');
    } else if (theme === 'light') {
      root.style.setProperty('--bg-gradient', 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)');
      root.style.setProperty('--text-color', '#333333');
    } else {
      // Auto - detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setSaveMessage('');
    
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
        setSaveMessage('✅ Settings saved successfully!');
        applyTheme(settings.preferences.theme);
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('❌ Failed to save settings');
      }
    } catch (error) {
      console.error('Error:', error);
      setSaveMessage('❌ Error saving settings!');
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

  const updateShortcut = (key, value) => {
    setSettings(prev => ({
      ...prev,
      shortcuts: {
        ...prev.shortcuts,
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
        <div className="loading-settings">
          <div className="spinner"></div>
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="settings">
        <div className="settings-header">
          <h2>⚙️ Settings</h2>
        </div>
        <div className="error-settings">
          <p>❌ Failed to load settings</p>
          <button onClick={loadSettings}>Retry</button>
        </div>
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
        {/* Appearance Settings */}
        <div className="settings-section">
          <h3>🎨 Appearance</h3>
          
          <div className="setting-item">
            <label>Theme</label>
            <div className="theme-selector">
              <button
                className={`theme-option ${settings.preferences.theme === 'light' ? 'active' : ''}`}
                onClick={() => updatePreference('theme', 'light')}
              >
                ☀️ Light
              </button>
              <button
                className={`theme-option ${settings.preferences.theme === 'dark' ? 'active' : ''}`}
                onClick={() => updatePreference('theme', 'dark')}
              >
                🌙 Dark
              </button>
              <button
                className={`theme-option ${settings.preferences.theme === 'auto' ? 'active' : ''}`}
                onClick={() => updatePreference('theme', 'auto')}
              >
                🔄 Auto
              </button>
            </div>
          </div>

          <div className="setting-item">
            <label>Font Size: {settings.preferences.fontSize}px</label>
            <div className="slider-container">
              <button 
                className="slider-btn"
                onClick={() => updatePreference('fontSize', Math.max(12, settings.preferences.fontSize - 2))}
              >
                A-
              </button>
              <input
                type="range"
                min="12"
                max="24"
                value={settings.preferences.fontSize}
                onChange={(e) => updatePreference('fontSize', parseInt(e.target.value))}
                className="font-slider"
              />
              <button 
                className="slider-btn"
                onClick={() => updatePreference('fontSize', Math.min(24, settings.preferences.fontSize + 2))}
              >
                A+
              </button>
            </div>
          </div>
        </div>

        {/* Feature Settings */}
        <div className="settings-section">
          <h3>🚀 Features</h3>
          
          <div className="setting-item toggle-item">
            <div className="toggle-label">
              <span>Auto Clean Tabs</span>
              <small>Automatically suggest tab cleanup</small>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.preferences.autoCleanTabs}
                onChange={(e) => updatePreference('autoCleanTabs', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item toggle-item">
            <div className="toggle-label">
              <span>Show Quick Actions</span>
              <small>Display quick action buttons</small>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.preferences.showQuickActions}
                onChange={(e) => updatePreference('showQuickActions', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item toggle-item">
            <div className="toggle-label">
              <span>Keyboard Shortcuts</span>
              <small>Enable keyboard shortcuts</small>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.preferences.enableKeyboardShortcuts}
                onChange={(e) => updatePreference('enableKeyboardShortcuts', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
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
              className="settings-select"
            >
              <option value="eli5">🧸 ELI5 (Explain Like I'm 5)</option>
              <option value="simple">😊 Simple</option>
              <option value="medium">📚 Medium</option>
              <option value="technical">🔬 Technical</option>
            </select>
          </div>

          <div className="setting-item">
            <label>AI Provider</label>
            <select
              value={settings.preferences.aiProvider}
              onChange={(e) => updatePreference('aiProvider', e.target.value)}
              className="settings-select"
            >
              <option value="groq">Groq (Free & Fast) ⚡</option>
              <option value="openai">OpenAI (Requires API Key)</option>
            </select>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="settings-section">
          <h3>🔒 Privacy</h3>
          
          <div className="setting-item toggle-item">
            <div className="toggle-label">
              <span>Save History</span>
              <small>Store browsing and analysis history</small>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.preferences.saveHistory}
                onChange={(e) => updatePreference('saveHistory', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item toggle-item">
            <div className="toggle-label">
              <span>Enable Analytics</span>
              <small>Anonymous usage stats (helps improve)</small>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.preferences.enableAnalytics}
                onChange={(e) => updatePreference('enableAnalytics', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* About */}
        <div className="settings-section">
          <h3>ℹ️ About</h3>
          <div className="about-info">
            <p><strong>🤖 BrowserBuddy AI</strong></p>
            <p>Version: 1.0.0</p>
            <p>Built with ❤️ for College Project</p>
            <p>Powered by Groq AI (Llama 3.3)</p>
            <p className="tech-stack">Tech: React + Node.js + MongoDB + Express</p>
          </div>
        </div>

        {/* Save Button */}
        <div className="settings-footer">
          {saveMessage && (
            <div className={`save-message ${saveMessage.includes('✅') ? 'success' : 'error'}`}>
              {saveMessage}
            </div>
          )}
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