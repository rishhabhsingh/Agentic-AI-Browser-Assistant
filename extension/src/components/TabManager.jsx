import { useState, useEffect } from 'react';
import './TabManager.css';

const API_URL = 'https://browser-buddy-backend.onrender.com/api';

function TabManager() {
  const [tabs, setTabs] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [selectedTabs, setSelectedTabs] = useState(new Set());

  useEffect(() => {
    loadTabs();
  }, []);

  const loadTabs = async () => {
    try {
      // Get all tabs from Chrome
      chrome.tabs.query({}, (chromeTabs) => {
        const tabList = chromeTabs.map(tab => ({
          id: tab.id,
          title: tab.title,
          url: tab.url,
          favIconUrl: tab.favIconUrl,
          active: tab.active
        }));
        setTabs(tabList);
      });
    } catch (error) {
      console.error('Error loading tabs:', error);
    }
  };

  const analyzeTabs = async (useAI = true) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/tabs/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tabs, useAI })
      });

      const data = await response.json();
      
      if (data.success) {
        setSuggestions(data.suggestions || []);
        
        // Auto-select suggested tabs
        const suggested = new Set();
        data.suggestions.forEach(s => {
          if (s.tab?.id) suggested.add(s.tab.id);
        });
        setSelectedTabs(suggested);
      }
    } catch (error) {
      console.error('Error analyzing tabs:', error);
      alert('Failed to analyze tabs. Make sure backend is running!');
    } finally {
      setLoading(false);
    }
  };

  const getTabStats = async () => {
    try {
      const response = await fetch(`${API_URL}/tabs/stats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tabs })
      });

      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error getting stats:', error);
    }
  };

  const toggleTabSelection = (tabId) => {
    const newSelected = new Set(selectedTabs);
    if (newSelected.has(tabId)) {
      newSelected.delete(tabId);
    } else {
      newSelected.add(tabId);
    }
    setSelectedTabs(newSelected);
  };

  const closeSelectedTabs = () => {
    if (selectedTabs.size === 0) {
      alert('No tabs selected!');
      return;
    }

    const confirmClose = window.confirm(
      `Close ${selectedTabs.size} tab(s)?`
    );

    if (confirmClose) {
      const tabIds = Array.from(selectedTabs);
      chrome.tabs.remove(tabIds, () => {
        loadTabs(); // Reload tabs
        setSelectedTabs(new Set());
        setSuggestions([]);
        alert(`✅ Closed ${tabIds.length} tabs!`);
      });
    }
  };

  const getSuggestionForTab = (tabId) => {
    return suggestions.find(s => s.tab?.id === tabId);
  };

  return (
    <div className="tab-manager">
      <div className="tm-header">
        <h2>🗂️ Smart Tab Manager</h2>
        <p className="tm-subtitle">
          {tabs.length} tab(s) open
          {selectedTabs.size > 0 && ` • ${selectedTabs.size} selected`}
        </p>
      </div>

      <div className="tm-actions">
        <button 
          className="btn btn-primary"
          onClick={() => analyzeTabs(true)}
          disabled={loading}
        >
          {loading ? '🔄 Analyzing...' : '🤖 AI Analysis'}
        </button>
        
        <button 
          className="btn btn-secondary"
          onClick={() => analyzeTabs(false)}
          disabled={loading}
        >
          🔍 Quick Scan
        </button>
        
        <button 
          className="btn btn-info"
          onClick={getTabStats}
        >
          📊 Stats
        </button>
      </div>

      {stats && (
        <div className="stats-box">
          <h4>📈 Statistics</h4>
          <p>Total: {stats.total} tabs</p>
          <p>Secure (HTTPS): {stats.protocols.https}</p>
          <div className="top-domains">
            <strong>Top Domains:</strong>
            {stats.topDomains?.map((d, i) => (
              <span key={i} className="domain-tag">
                {d.domain} ({d.count})
              </span>
            ))}
          </div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="suggestions-box">
          <h4>💡 AI Suggestions</h4>
          <p>Found {suggestions.length} tab(s) you might want to close:</p>
        </div>
      )}

      <div className="tab-list">
        {tabs.map((tab) => {
          const suggestion = getSuggestionForTab(tab.id);
          const isSelected = selectedTabs.has(tab.id);
          
          return (
            <div 
              key={tab.id} 
              className={`tab-item ${isSelected ? 'selected' : ''} ${suggestion ? 'suggested' : ''}`}
              onClick={() => toggleTabSelection(tab.id)}
            >
              <div className="tab-checkbox">
                <input 
                  type="checkbox" 
                  checked={isSelected}
                  onChange={() => {}}
                />
              </div>
              
              <div className="tab-favicon">
                {tab.favIconUrl ? (
                  <img src={tab.favIconUrl} alt="" />
                ) : (
                  <span>🌐</span>
                )}
              </div>
              
              <div className="tab-info">
                <div className="tab-title">
                  {tab.title}
                  {tab.active && <span className="active-badge">Active</span>}
                </div>
                <div className="tab-url">{new URL(tab.url).hostname}</div>
                
                {suggestion && (
                  <div className="suggestion-reason">
                    <span className="confidence-badge">
                      {suggestion.confidence}% confident
                    </span>
                    {suggestion.reason}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedTabs.size > 0 && (
        <div className="tm-footer">
          <button 
            className="btn btn-danger"
            onClick={closeSelectedTabs}
          >
            🗑️ Close {selectedTabs.size} Tab(s)
          </button>
          <button 
            className="btn btn-ghost"
            onClick={() => setSelectedTabs(new Set())}
          >
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
}

export default TabManager;