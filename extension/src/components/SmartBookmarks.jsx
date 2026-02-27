import { useState, useEffect } from 'react';
import './SmartBookmarks.css';

const API_URL = 'https://browser-buddy-backend.onrender.com/api';

function SmartBookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBookmarks();
  }, [selectedCategory]);

  const loadBookmarks = async () => {
    try {
      const response = await fetch(
        `${API_URL}/bookmarks/list?userId=default_user&category=${selectedCategory}`
      );
      const data = await response.json();
      
      if (data.success) {
        setBookmarks(data.bookmarks || []);
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  const bookmarkCurrentPage = async () => {
    setLoading(true);
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const currentTab = tabs[0];

      const response = await fetch(`${API_URL}/bookmarks/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'default_user',
          title: currentTab.title,
          url: currentTab.url,
          description: ''
        })
      });

      const data = await response.json();
      
      if (data.success) {
        await loadBookmarks();
        alert('✅ Bookmark saved with AI categorization!');
      }
    } catch (error) {
      console.error('Error bookmarking:', error);
      alert('❌ Failed to bookmark. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const searchBookmarks = async () => {
    if (!searchQuery.trim()) {
      loadBookmarks();
      return;
    }

    try {
      const response = await fetch(`${API_URL}/bookmarks/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'default_user',
          query: searchQuery
        })
      });

      const data = await response.json();
      if (data.success) {
        setBookmarks(data.bookmarks || []);
      }
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const deleteBookmark = async (id) => {
    if (!confirm('Delete this bookmark?')) return;

    try {
      await fetch(`${API_URL}/bookmarks/${id}`, { method: 'DELETE' });
      loadBookmarks();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const filteredBookmarks = searchQuery 
    ? bookmarks 
    : bookmarks;

  return (
    <div className="smart-bookmarks">
      {/* Header */}
      <div className="sb-header">
        <div className="sb-title">
          <span className="sb-icon">🔖</span>
          <div>
            <h2>Smart Bookmarks</h2>
            <p className="sb-subtitle">AI-categorized bookmarks</p>
          </div>
        </div>
      </div>

      {/* Add Bookmark Button */}
      <div className="sb-add-section">
        <button 
          className="sb-add-btn"
          onClick={bookmarkCurrentPage}
          disabled={loading}
        >
          <span className="btn-icon">✨</span>
          {loading ? 'Saving...' : 'Bookmark This Page'}
        </button>
      </div>

      {/* Search & Filter */}
      <div className="sb-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchBookmarks()}
            className="search-input"
          />
          <button className="search-btn" onClick={searchBookmarks}>
            🔍
          </button>
        </div>

        {/* Category Pills */}
        <div className="category-pills">
          <button
            className={`pill ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </button>
          {categories.slice(0, 5).map((cat) => (
            <button
              key={cat}
              className={`pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Bookmarks List */}
      <div className="sb-list">
        {filteredBookmarks.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📚</span>
            <h3>No bookmarks yet</h3>
            <p>Bookmark your first page to get started!</p>
          </div>
        ) : (
          filteredBookmarks.map((bookmark) => (
            <div key={bookmark._id} className="bookmark-card">
              <div className="bookmark-header">
                <div className="bookmark-favicon">
                  {bookmark.url ? (
                    <img 
                      src={`https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}&sz=32`}
                      alt=""
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  ) : (
                    <span>🌐</span>
                  )}
                </div>
                <div className="bookmark-info">
                  <h3 className="bookmark-title">
                    <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                      {bookmark.title}
                    </a>
                  </h3>
                  <p className="bookmark-url">
                    {bookmark.url ? new URL(bookmark.url).hostname : ''}
                  </p>
                </div>
                <button 
                  className="bookmark-delete"
                  onClick={() => deleteBookmark(bookmark._id)}
                  title="Delete bookmark"
                >
                  ×
                </button>
              </div>

              {bookmark.summary && (
                <p className="bookmark-summary">{bookmark.summary}</p>
              )}

              <div className="bookmark-footer">
                <span className="bookmark-category">{bookmark.category}</span>
                <div className="bookmark-tags">
                  {bookmark.tags?.slice(0, 3).map((tag, i) => (
                    <span key={i} className="tag">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats Footer */}
      {bookmarks.length > 0 && (
        <div className="sb-footer">
          <span className="stats-icon">📊</span>
          <span>{bookmarks.length} bookmark(s) in {selectedCategory === 'all' ? 'all categories' : selectedCategory}</span>
        </div>
      )}
    </div>
  );
}

export default SmartBookmarks;
