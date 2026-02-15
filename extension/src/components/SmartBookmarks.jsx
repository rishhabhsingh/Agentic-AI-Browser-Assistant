import { useState, useEffect } from 'react';
import './SmartBookmarks.css';

const API_URL = 'https://agentic-ai-browser-assistant.onrender.com';

function SmartBookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadBookmarks();
  }, [selectedCategory]);

  const loadBookmarks = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/bookmarks/list?userId=default_user&category=${selectedCategory}`
      );
      const data = await response.json();

      if (data.success) {
        setBookmarks(data.bookmarks);
        setCategories(['all', ...data.categories]);
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCurrentPage = async () => {
    setAdding(true);
    try {
      // Get current tab
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        const tab = tabs[0];

        const response = await fetch(`${API_URL}/bookmarks/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 'default_user',
            title: tab.title,
            url: tab.url,
            description: tab.title,
            favicon: tab.favIconUrl
          })
        });

        const data = await response.json();

        if (data.success) {
          alert(`✅ Bookmarked as: ${data.bookmark.category}`);
          loadBookmarks();
        } else {
          alert('Failed to add bookmark');
        }
        setAdding(false);
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding bookmark!');
      setAdding(false);
    }
  };

  const searchBookmarks = async () => {
    if (!searchQuery.trim()) {
      loadBookmarks();
      return;
    }

    setLoading(true);
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
        setBookmarks(data.bookmarks);
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBookmark = async (id) => {
    if (!confirm('Delete this bookmark?')) return;

    try {
      const response = await fetch(`${API_URL}/bookmarks/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        loadBookmarks();
      }
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const openBookmark = (url) => {
    chrome.tabs.create({ url });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Technology': '💻',
      'Education': '📚',
      'News': '📰',
      'Entertainment': '🎬',
      'Shopping': '🛒',
      'Social Media': '📱',
      'Tools': '🔧',
      'Work': '💼',
      'Finance': '💰',
      'Health': '🏥',
      'Travel': '✈️',
      'Other': '📌'
    };
    return icons[category] || '🔖';
  };

  return (
    <div className="smart-bookmarks">
      <div className="sb-header">
        <h2>🔖 Smart Bookmarks</h2>
        <p className="sb-subtitle">AI-organized bookmarks</p>
      </div>

      {/* Add Current Page */}
      <div className="sb-add">
        <button 
          className="add-current-btn"
          onClick={addCurrentPage}
          disabled={adding}
        >
          {adding ? '🔄 Adding...' : '➕ Bookmark This Page'}
        </button>
      </div>

      {/* Search Bar */}
      <div className="sb-search">
        <input
          type="text"
          placeholder="🔍 Search bookmarks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchBookmarks()}
        />
        <button onClick={searchBookmarks}>Search</button>
      </div>

      {/* Category Filter */}
      <div className="sb-categories">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat === 'all' ? '📂 All' : `${getCategoryIcon(cat)} ${cat}`}
          </button>
        ))}
      </div>

      {/* Bookmarks List */}
      {loading ? (
        <div className="sb-loading">Loading bookmarks...</div>
      ) : bookmarks.length === 0 ? (
        <div className="sb-empty">
          <p>📭 No bookmarks yet</p>
          <p className="hint">Add your first bookmark to get started!</p>
        </div>
      ) : (
        <div className="sb-list">
          {bookmarks.map(bookmark => (
            <div key={bookmark._id} className="bookmark-item">
              <div 
                className="bookmark-content"
                onClick={() => openBookmark(bookmark.url)}
              >
                <div className="bookmark-icon">
                  {bookmark.favicon ? (
                    <img src={bookmark.favicon} alt="" />
                  ) : (
                    <span>{getCategoryIcon(bookmark.category)}</span>
                  )}
                </div>
                <div className="bookmark-info">
                  <div className="bookmark-title">{bookmark.title}</div>
                  <div className="bookmark-url">
                    {new URL(bookmark.url).hostname}
                  </div>
                  {bookmark.summary && (
                    <div className="bookmark-summary">{bookmark.summary}</div>
                  )}
                  <div className="bookmark-tags">
                    {bookmark.tags.map((tag, i) => (
                      <span key={i} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <button 
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteBookmark(bookmark._id);
                }}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {bookmarks.length > 0 && (
        <div className="sb-stats">
          <p>📊 {bookmarks.length} bookmark(s) in {selectedCategory === 'all' ? 'all categories' : selectedCategory}</p>
        </div>
      )}
    </div>
  );
}

export default SmartBookmarks;