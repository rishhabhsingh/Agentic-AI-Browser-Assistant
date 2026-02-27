import { useState, useEffect } from 'react';
import './App.css';
import TabManager from './components/TabManager.jsx';
import ContentSimplifier from './components/ContentSimplifier'
import YouTubeSummary from './components/YouTubeSummary'
import ReadingMode from './components/ReadingMode'
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
      setBackendStatus('✅ Connected');
    } catch (error) {
      setBackendStatus('❌ Backend Offline');
    }
  };

    // Render different views
      if (activeView === 'tabs') {
        return (
          <div className="app">
            <button className="back-btn" onClick={() => setActiveView('home')}>
              ← Back to Home
            </button>
            <TabManager />
          </div>
        );
      }
    
      if (activeView === 'simplify') {
        return (
          <div className="app">
            <button className="back-btn" onClick={() => setActiveView('home')}>
              ← Back to Home
            </button>
            <ContentSimplifier />
          </div>
        );
      }
    
      if (activeView === 'youtube') {
        return (
          <div className="app">
            <button className="back-btn" onClick={() => setActiveView('home')}>
              ← Back to Home
            </button>
            <YouTubeSummary />
          </div>
        );
      }
    
      if (activeView === 'reading') {
        return (
          <div className="app">
            <button className="back-btn" onClick={() => setActiveView('home')}>
              ← Back to Home
            </button>
            <ReadingMode />
          </div>
        );
      }
    
      if (activeView === 'bookmarks') {
        return (
          <div className="app">
            <button className="back-btn" onClick={() => setActiveView('home')}>
              ← Back to Home
            </button>
            <SmartBookmarks />
          </div>
        );
      }
    
      if (activeView === 'formfill') {
        return (
          <div className="app">
            <button className="back-btn" onClick={() => setActiveView('home')}>
              ← Back to Home
            </button>
            <FormFiller />
          </div>
        );
      }
    
      if (activeView === 'resume') {
        return (
          <div className="app">
            <button className="back-btn" onClick={() => setActiveView('home')}>
              ← Back to Home
            </button>
            <ResumeOptimizer />
          </div>
        );
      }
    
      if (activeView === 'settings') {
        return (
          <div className="app">
            <button className="back-btn" onClick={() => setActiveView('home')}>
              ← Back to Home
            </button>
            <Settings />
          </div>
        );
      }
    
      // Main home view - COMPLETELY REDESIGNED
      return (
        <div className="app">
          {/* Premium Header */}
          <div className="header-premium">
            <div className="logo-container">
              <span>
                <img src="icons/robotics32.png" alt="BrowserBuddy Logo" className="logo" />
              </span>
              <div className="logo-text">
                <h1>BrowserBuddy AI</h1>
                <p className="tagline">Your Intelligent Browsing Assistant</p>
              </div>
            </div>
            
            <div className={`status-badge ${backendStatus === 'Connected' ? 'status-connected' : 'status-offline'}`}>
              <span className="status-dot"></span>
              {backendStatus}
            </div>
          </div>
    
          {/* Current Tab Info - Compact */}
          {activeTab && (
            <div className="current-tab-card">
              <div className="tab-icon">📍</div>
              <div className="tab-details">
                <div className="tab-title-mini">{activeTab.title}</div>
                <div className="tab-url-mini">{new URL(activeTab.url).hostname}</div>
              </div>
            </div>
          )}
    
          {/* Feature Grid - Landing Page Style */}
          <div className="features-grid">
            <button 
              className="feature-card feature-purple"
              onClick={() => setActiveView('tabs')}
            >
              <div className="feature-icon">🗂️</div>
              <div className="feature-content">
                <h3>Tab Manager</h3>
                <p>AI-powered organization</p>
              </div>
              <div className="feature-arrow">→</div>
            </button>
    
            <button 
              className="feature-card feature-blue"
              onClick={() => setActiveView('simplify')}
            >
              <div className="feature-icon">📝</div>
              <div className="feature-content">
                <h3>Content Simplifier</h3>
                <p>Easy to understand</p>
              </div>
              <div className="feature-arrow">→</div>
            </button>
    
            <button 
              className="feature-card feature-red"
              onClick={() => setActiveView('youtube')}
            >
              <div className="feature-icon">🎥</div>
              <div className="feature-content">
                <h3>YouTube Summary</h3>
                <p>Video insights</p>
              </div>
              <div className="feature-arrow">→</div>
            </button>
            
            <button 
              className="feature-card feature-green"
              onClick={() => setActiveView('reading')}
            >
              <div className="feature-icon">📖</div>
              <div className="feature-content">
                <h3>Reading Mode</h3>
                <p>Distraction-free</p>
              </div>
              <div className="feature-arrow">→</div>
            </button>
    
            <button 
              className="feature-card feature-pink"
              onClick={() => setActiveView('bookmarks')}
            >
              <div className="feature-icon">🔖</div>
              <div className="feature-content">
                <h3>Smart Bookmarks</h3>
                <p>Auto-categorized</p>
              </div>
              <div className="feature-arrow">→</div>
            </button>
    
            <button 
              className="feature-card feature-teal"
              onClick={() => setActiveView('resume')}
            >
              <div className="feature-icon">📄</div>
              <div className="feature-content">
                <h3>Resume Builder</h3>
                <p>ATS-friendly</p>
              </div>
              <div className="feature-arrow">→</div>
            </button>
    
            <button 
              className="feature-card feature-gray"
              onClick={() => setActiveView('settings')}
            >
              <div className="feature-icon">⚙️</div>
              <div className="feature-content">
                <h3>Settings</h3>
                <p>Customize your experience</p>
              </div>
              <div className="feature-arrow">→</div>
            </button>
          </div>
    
          {/* Footer */}
          <div className="footer-premium">
            <p>Made with ❤️ for College Final Year Project</p>
            <p>By Rishabh Singh</p>
          </div>
        </div>
      );
    }
    
    export default App;
    