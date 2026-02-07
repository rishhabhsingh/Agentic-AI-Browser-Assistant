import { useState, useEffect } from 'react';
import './App.css';
import TabManager from './components/TabManager.jsx';

function App() {
  const [activeView, setActiveView] = useState('home');
  const [activeTab, setActiveTab] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking...');

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        setActiveTab(tabs[0]);
      }
    });
    checkBackend();
  }, []);

  const checkBackend = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health');
      const data = await response.json();
      setBackendStatus(data.status === 'ok' ? '✅ Connected' : '❌ Error');
    } catch (error) {
      setBackendStatus('❌ Backend Offline');
    }
  };

  if (activeView === 'tabs') {
    return (
      <div className="app">
        <button className="back-btn" onClick={() => setActiveView('home')}>
          ← Back
        </button>
        <TabManager />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🤖 BrowserBuddy AI</h1>
        <p className="subtitle">Your Intelligent Browsing Assistant</p>
      </header>

      <div className="status-bar">
        <span>Backend: {backendStatus}</span>
      </div>

      <div className="content">
        <div className="section">
          <h3>📍 Current Tab</h3>
          {activeTab && (
            <div className="tab-info">
              <p className="tab-title">{activeTab.title}</p>
              <p className="tab-url">{activeTab.url}</p>
            </div>
          )}
        </div>

        <div className="section">
          <h3>🚀 Quick Actions</h3>
          
          <button 
            className="action-btn" 
            onClick={() => setActiveView('tabs')}
          >
            🗂️ Manage Tabs (NEW!)
          </button>
          
          <button className="action-btn" onClick={() => alert('Coming in Day 3!')}>
            📝 Simplify Content
          </button>
          
          <button className="action-btn" onClick={() => alert('Coming in Day 4!')}>
            🎥 YouTube Summary
          </button>
        </div>

        <div className="section">
          <h3>⚙️ Settings</h3>
          <button className="settings-btn" onClick={() => alert('Coming in Day 5!')}>
            Open Settings
          </button>
        </div>
      </div>

      <footer className="footer">
        <p>Made with ❤️ for College Project</p>
      </footer>
    </div>
  );
}

export default App;