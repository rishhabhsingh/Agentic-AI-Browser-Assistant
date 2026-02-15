import { useState } from 'react';
import './ContentSimplifier.css';

const API_URL = 'https://browser-buddy-backend.onrender.com/api';

function ContentSimplifier() {
  const [selectedText, setSelectedText] = useState('');
  const [simplified, setSimplified] = useState('');
  const [level, setLevel] = useState('simple');
  const [loading, setLoading] = useState(false);
  const [pageUrl, setPageUrl] = useState('');

  const levels = [
    { value: 'eli5', label: '🧸 ELI5', desc: 'Like I\'m 5' },
    { value: 'simple', label: '😊 Simple', desc: 'Easy to read' },
    { value: 'medium', label: '📚 Medium', desc: 'Balanced' },
    { value: 'technical', label: '🔬 Technical', desc: 'Detailed' }
  ];

  const getSelectedText = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || !tabs[0]) {
      alert('No active tab found!');
      return;
    }

    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: 'getSelection' },
      (response) => {
        // Check for errors
        if (chrome.runtime.lastError) {
          console.error('❌ Runtime error:', chrome.runtime.lastError.message);
          alert('Error: Please refresh the page and try again!');
          return;
        }

        if (response && response.text) {
          if (response.text.length === 0) {
            alert('No text selected! Please highlight some text on the page first.');
            return;
          }
          setSelectedText(response.text);
          setPageUrl(tabs[0].url);
        } else {
          alert('Could not get selected text. Please refresh the page and try again!');
        }
      }
    );
  });
};

const simplifyText = async () => {
  if (!selectedText) {
    alert('No text selected!');
    return;
  }

  setLoading(true);
  try {
    console.log('Sending to:', `${API_URL}/simplify/text`);
    console.log('Data:', { text: selectedText, level });

    const response = await fetch(`${API_URL}/simplify/text`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        text: selectedText,
        level: level
      })
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (data.success) {
      setSimplified(data.simplified);
    } else {
      alert('Failed: ' + (data.message || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error! Make sure backend is running on http://localhost:5000');
  } finally {
    setLoading(false);
  }
};
  const summarizePage = async () => {
  setLoading(true);
  
  try {
    // Get current active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
      alert('No active tab found!');
      setLoading(false);
      return;
    }

    console.log('📍 Current tab:', tab.url);

    // Send message to content script
    chrome.tabs.sendMessage(
      tab.id,
      { action: 'getPageContent' },
      async (response) => {
        // Check for errors
        if (chrome.runtime.lastError) {
          console.error('❌ Chrome runtime error:', chrome.runtime.lastError.message);
          alert('Error: Could not access page content. Try refreshing the page!');
          setLoading(false);
          return;
        }

        if (!response || !response.text) {
          alert('Could not extract page content. Try refreshing the page!');
          setLoading(false);
          return;
        }

        console.log('✅ Got page content:', response.text.length, 'chars');

        // Call backend API
        try {
          const apiResponse = await fetch(`${API_URL}/simplify/page`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              content: response.text,
              url: tab.url,
              level: level
            })
          });

          const data = await apiResponse.json();

          if (data.success) {
            setSimplified(data.summary);
            setPageUrl(tab.url);
          } else {
            alert('Failed to summarize: ' + (data.message || 'Unknown error'));
          }
        } catch (error) {
          console.error('API Error:', error);
          alert('Backend error! Make sure server is running.');
        } finally {
          setLoading(false);
        }
      }
    );

  } catch (error) {
    console.error('Error:', error);
    alert('Error summarizing page!');
    setLoading(false);
  }
};

  const copyToClipboard = () => {
    navigator.clipboard.writeText(simplified);
    alert('✅ Copied to clipboard!');
  };

  return (
    <div className="content-simplifier">
      <div className="cs-header">
        <h2>📝 Content Simplifier</h2>
        <p className="cs-subtitle">Make any content easier to understand</p>
      </div>

      {/* Level Selector */}
      <div className="level-selector">
        <h4>Choose Reading Level:</h4>
        <div className="level-buttons">
          {levels.map((l) => (
            <button
              key={l.value}
              className={`level-btn ${level === l.value ? 'active' : ''}`}
              onClick={() => setLevel(l.value)}
            >
              <div className="level-label">{l.label}</div>
              <div className="level-desc">{l.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="cs-actions">
        <button
          className="action-btn primary"
          onClick={getSelectedText}
          disabled={loading}
        >
          📋 Get Selected Text
        </button>
        <button
          className="action-btn secondary"
          onClick={summarizePage}
          disabled={loading}
        >
          📄 Summarize Page
        </button>
      </div>

      {/* Selected Text Preview */}
      {selectedText && (
        <div className="text-preview">
          <h4>Selected Text:</h4>
          <div className="preview-box">
            {selectedText.substring(0, 200)}
            {selectedText.length > 200 && '...'}
          </div>
          <button
            className="simplify-btn"
            onClick={simplifyText}
            disabled={loading}
          >
            {loading ? '🔄 Simplifying...' : '✨ Simplify This'}
          </button>
        </div>
      )}

      {/* Simplified Result */}
      {simplified && (
        <div className="result-box">
          <div className="result-header">
            <h4>✨ Simplified ({level}):</h4>
            <button className="copy-btn" onClick={copyToClipboard}>
              📋 Copy
            </button>
          </div>
          <div className="result-content">
            {simplified}
          </div>
          {pageUrl && (
            <div className="result-footer">
              <span>From: {new URL(pageUrl).hostname}</span>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      {!selectedText && !simplified && (
        <div className="instructions">
          <h4>How to use:</h4>
          <ol>
            <li>Select reading level above</li>
            <li>Highlight text on any webpage</li>
            <li>Click "Get Selected Text"</li>
            <li>Click "Simplify This"</li>
          </ol>
          <p className="tip">
            💡 Tip: Use "Summarize Page" for quick page overview!
          </p>
        </div>
      )}
    </div>
  );
}

export default ContentSimplifier;