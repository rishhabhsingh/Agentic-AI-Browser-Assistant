import { useState } from 'react';
import './ReadingMode.css';

function ReadingMode() {
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState('light');
  const [isActive, setIsActive] = useState(false);

  const enableReadingMode = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
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
      }
    });
  };

  const disableReadingMode = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: 'disableReadingMode' },
          (response) => {
            if (response && response.success) {
              setIsActive(false);
            }
          }
        );
      }
    });
  };

  return (
    <div className="reading-mode">
      <div className="reading-header">
        <h2>📖 Reading Mode</h2>
        <p className="reading-subtitle">Distraction-free reading</p>
      </div>

      <div className="reading-controls">
        <div className="control-group">
          <label>Font Size: {fontSize}px</label>
          <div className="font-size-controls">
            <button 
              className="font-btn"
              onClick={() => setFontSize(Math.max(12, fontSize - 2))}
            >
              A-
            </button>
            <input
              type="range"
              min="12"
              max="24"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="font-slider"
            />
            <button 
              className="font-btn"
              onClick={() => setFontSize(Math.min(24, fontSize + 2))}
            >
              A+
            </button>
          </div>
        </div>

        <div className="control-group">
          <label>Theme</label>
          <div className="theme-buttons">
            <button
              className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => setTheme('light')}
            >
              ☀️ Light
            </button>
            <button
              className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
            >
              🌙 Dark
            </button>
          </div>
        </div>

        {!isActive ? (
          <button className="enable-btn" onClick={enableReadingMode}>
            📖 Enable Reading Mode
          </button>
        ) : (
          <button className="disable-btn" onClick={disableReadingMode}>
            ✕ Exit Reading Mode
          </button>
        )}
      </div>

      {!isActive && (
        <div className="reading-info">
          <h4>What gets removed:</h4>
          <ul>
            <li>✓ Advertisements</li>
            <li>✓ Sidebars</li>
            <li>✓ Pop-ups</li>
            <li>✓ Navigation menus</li>
          </ul>
          <p className="hint">📌 Open an article or blog post, then enable reading mode</p>
        </div>
      )}
    </div>
  );
}

export default ReadingMode;