import { useState, useEffect } from 'react';
import './App.css';
import TabManager from './components/TabManager.jsx';
import ContentSimplifier from './components/ContentSimplifier'
import YouTubeSummary from './components/YouTubeSummary'
import ReadingMode from './components/ReadingMode'
import FormFiller from './components/FormFiller'
import ResumeOptimizer from './components/ResumeOptimizer'
import Settings from './components/Settings';
import SmartBookmarks from './components/SmartBookmarks';

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

    if (activeView === 'simplify') {
    return (
      <div className="app">
        <button className="back-btn" onClick={() => setActiveView('home')}>
          ← Back
        </button>
        <ContentSimplifier />
      </div>
    );
  }

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

  if (activeView === 'youtube') {
    return (
      <div className="app">
        <button className="back-btn" onClick={() => setActiveView('home')}>
          ← Back
        </button>
        <YouTubeSummary />
      </div>
    );
  }

  if (activeView === 'reading') {
    return (
      <div className="app">
        <button className="back-btn" onClick={() => setActiveView('home')}>
          ← Back
        </button>
        <ReadingMode />
      </div>
    );
  }

  if (activeView === 'formfill') {
    return (
      <div className="app">
        <button className="back-btn" onClick={() => setActiveView('home')}>
          ← Back
        </button>
        <FormFiller />
      </div>
    );
  }

  if (activeView === 'resume') {
    return (
      <div className="app">
        <button className="back-btn" onClick={() => setActiveView('home')}>
          ← Back
        </button>
        <ResumeOptimizer />
      </div>
    );
  }

  // Settings View
  if (activeView === 'settings') {
    return (
      <div className="app">
        <button className="back-btn" onClick={() => setActiveView('home')}>
          ← Back
        </button>
        <Settings />
      </div>
    );
  }

  // Bookmarks View
  if (activeView === 'bookmarks') {
    return (
      <div className="app">
        <button className="back-btn" onClick={() => setActiveView('home')}>
          ← Back
        </button>
        <SmartBookmarks />
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
            🗂️ Smart Tab Manager
          </button>
          
          <button 
            className="action-btn" 
            onClick={() => setActiveView('simplify')}
          >
            📝 Content Simplifier
          </button>
          
          <div className="section">
          <h3>🎥 Experimental</h3>
          <button 
            className="action-btn experimental" 
            onClick={() => setActiveView('youtube')}
          >
            🎥 YouTube Summary
            <span className="beta-badge">BETA</span>
          </button>
        </div>

          <button 
            className="action-btn" 
            onClick={() => setActiveView('reading')}
          >
            📖 Reading Mode
          </button>

          <button 
            className="action-btn" 
            onClick={() => setActiveView('bookmarks')}
          >
            🔖 Smart Bookmarks
          </button>

          <div className="section">
        <h3>🎥 Experimental</h3>
         <button 
            className="action-btn experimental" 
            onClick={() => setActiveView('formfill')}
          >
            📝 Auto Form Filler
            <span className="beta-badge">BETA</span>
          </button>
      </div>

          <div className="section">
      <h3>🎥 Experimental</h3>
          <button 
            className="action-btn experimental" 
            onClick={() => setActiveView('resume')}
          >
            📄 Resume Optimizer
            <span className="beta-badge">BETA</span>
          </button>
      </div>
        </div>

       <div className="section">
          <h3>⚙️ Settings</h3>
          <button 
            className="settings-btn" 
            onClick={() => setActiveView('settings')}
          >
            ⚙️ Open Settings
          </button>
        </div>
      </div>

      <footer className="footer">
        <p>Made with ❤️ for College Project</p>
        <p className="version">v1.0.0 • Powered by Groq AI</p>
      </footer>
    </div>
  );
}

export default App;