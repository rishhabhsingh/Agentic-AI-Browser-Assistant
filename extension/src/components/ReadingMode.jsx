import { useState, useEffect } from 'react';
import './ReadingMode.css';

function ReadingMode() {
  const [isActive, setIsActive] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [darkMode, setDarkMode] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    // Get current tab URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        setCurrentUrl(tabs[0].url);
      }
    });
  }, []);

  const toggleReadingMode = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { 
          action: 'toggleReadingMode',
          fontSize: fontSize,
          darkMode: darkMode
        },
        (response) => {
          if (chrome.runtime.lastError) {
            alert('Error: Please refresh the page first!');
            return;
          }
          
          if (response && response.success) {
            setIsActive(!isActive);
          }
        }
      );
    });
  };

  const updateSettings = () => {
    if (isActive) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { 
            action: 'updateReadingMode',
            fontSize: fontSize,
            darkMode: darkMode
          }
        );
      });
    }
  };

  useEffect(() => {
    updateSettings();
  }, [fontSize, darkMode]);

  const canUseReadingMode = () => {
    // Check if URL is readable (not Chrome pages, PDFs, etc.)
    if (!currentUrl) return false;
    if (currentUrl.startsWith('chrome://')) return false;
    if (currentUrl.startsWith('chrome-extension://')) return false;
    if (currentUrl.endsWith('.pdf')) return false;
    return true;
  };

  return (
    <div className="reading-mode">
      <div className="rm-header">
        <h2>📖 Smart Reading Mode</h2>
        <p className="rm-subtitle">Distraction-free reading experience</p>
      </div>

      {canUseReadingMode() ? (
        <>
          {/* Toggle Button */}
          <div className="rm-toggle">
            <button 
              className={`toggle-btn ${isActive ? 'active' : ''}`}
              onClick={toggleReadingMode}
            >
              {isActive ? '✅ Reading Mode ON' : '📖 Enable Reading Mode'}
            </button>
          </div>

          {/* Settings */}
          <div className="rm-settings">
            <div className="setting-group">
              <h4>🔤 Font Size</h4>
              <div className="font-controls">
                <button 
                  className="font-btn"
                  onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                >
                  A-
                </button>
                <span className="font-value">{fontSize}px</span>
                <button 
                  className="font-btn"
                  onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                >
                  A+
                </button>
              </div>
              <input 
                type="range" 
                min="12" 
                max="24" 
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="font-slider"
              />
            </div>

            <div className="setting-group">
              <h4>🌙 Theme</h4>
              <div className="theme-toggle">
                <button 
                  className={`theme-btn ${!darkMode ? 'active' : ''}`}
                  onClick={() => setDarkMode(false)}
                >
                  ☀️ Light
                </button>
                <button 
                  className={`theme-btn ${darkMode ? 'active' : ''}`}
                  onClick={() => setDarkMode(true)}
                >
                  🌙 Dark
                </button>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="features-list">
            <h4>✨ What it does:</h4>
            <ul>
              <li>✅ Removes ads and popups</li>
              <li>✅ Hides sidebars and navigation</li>
              <li>✅ Focuses on main content</li>
              <li>✅ Adjustable font size</li>
              <li>✅ Light/Dark mode</li>
            </ul>
          </div>

          {/* Current Page Info */}
          <div className="page-info">
            <h4>📄 Current Page:</h4>
            <div className="url-display">
              {new URL(currentUrl).hostname}
            </div>
          </div>
        </>
      ) : (
        <div className="rm-unavailable">
          <p>❌ Reading mode not available for this page</p>
          <p className="hint">
            Works best on:<br/>
            • News articles<br/>
            • Blog posts<br/>
            • Wikipedia<br/>
            • Medium articles
          </p>
        </div>
      )}
    </div>
  );
}

export default ReadingMode;