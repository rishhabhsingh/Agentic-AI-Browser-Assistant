import { useState } from 'react';
import './ReadingMode.css';

function ReadingMode() {
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState('light');
  const [isActive, setIsActive] = useState(false);

  const enableReadingMode = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          action: 'enableReadingMode',
          fontSize: fontSize,
          theme: theme
        },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error:', chrome.runtime.lastError);
            alert('Please refresh the page and try again');
          } else if (response && response.success) {
            setIsActive(true);
          }
        }
      );
    });
  };

  const disableReadingMode = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: 'disableReadingMode' },
        (response) => {
          if (response && response.success) {
            setIsActive(false);
          }
        }
      );
    });
  };

  return (
    <div className="reading-mode-container">
      {/* Header */}
      <div className="rm-header">
        <div className="rm-title">
          <span className="rm-icon">📖</span>
          <div>
            <h2>Reading Mode</h2>
            <p className="rm-subtitle">Distraction-free reading experience</p>
          </div>
        </div>
      </div>

      {/* Controls Card */}
      <div className="rm-controls-card">
        {/* Font Size Control */}
        <div className="control-section">
          <label className="control-label">
            <span className="label-icon">🔤</span>
            Font Size: <strong>{fontSize}px</strong>
          </label>
          <div className="font-size-control">
            <button 
              className="size-btn"
              onClick={() => setFontSize(Math.max(12, fontSize - 2))}
              disabled={fontSize <= 12}
            >
              A-
            </button>
            <input
              type="range"
              min="12"
              max="24"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="size-slider"
            />
            <button 
              className="size-btn"
              onClick={() => setFontSize(Math.min(24, fontSize + 2))}
              disabled={fontSize >= 24}
            >
              A+
            </button>
          </div>
          <div className="size-preview">
            <span style={{ fontSize: `${fontSize}px` }}>Sample Text</span>
          </div>
        </div>

        {/* Theme Control */}
        <div className="control-section">
          <label className="control-label">
            <span className="label-icon">🎨</span>
            Theme
          </label>
          <div className="theme-selector">
            <button
              className={`theme-option ${theme === 'light' ? 'active' : ''}`}
              onClick={() => setTheme('light')}
            >
              <span className="theme-icon">☀️</span>
              <span className="theme-name">Light</span>
              <div className="theme-demo theme-demo-light"></div>
            </button>
            <button
              className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
            >
              <span className="theme-icon">🌙</span>
              <span className="theme-name">Dark</span>
              <div className="theme-demo theme-demo-dark"></div>
            </button>
          </div>
        </div>

        {/* Action Button */}
        {!isActive ? (
          <button className="rm-action-btn enable-btn" onClick={enableReadingMode}>
            <span className="btn-icon">📖</span>
            Enable Reading Mode
          </button>
        ) : (
          <button className="rm-action-btn disable-btn" onClick={disableReadingMode}>
            <span className="btn-icon">✕</span>
            Exit Reading Mode
          </button>
        )}
      </div>

      {/* Features List */}
      {!isActive && (
        <div className="rm-features">
          <h3 className="features-title">What gets removed:</h3>
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-check">✓</span>
              <span>Advertisements</span>
            </div>
            <div className="feature-item">
              <span className="feature-check">✓</span>
              <span>Sidebars</span>
            </div>
            <div className="feature-item">
              <span className="feature-check">✓</span>
              <span>Pop-ups</span>
            </div>
            <div className="feature-item">
              <span className="feature-check">✓</span>
              <span>Navigation menus</span>
            </div>
          </div>

          <div className="rm-tip">
            <span className="tip-icon">💡</span>
            <p>Open an article or blog post, then enable reading mode for the best experience</p>
          </div>
        </div>
      )}

      {/* Active Status */}
      {isActive && (
        <div className="rm-active-status">
          <div className="status-icon-animated">✨</div>
          <h3>Reading Mode Active</h3>
          <p>Your content is now displayed in a clean, focused layout</p>
        </div>
      )}
    </div>
  );
}

export default ReadingMode;
