import { useState, useEffect } from 'react';
import './YouTubeSummary.css';

const API_URL = 'https://browser-buddy-backend.onrender.com/api';

function YouTubeSummary() {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    // Check if current tab is YouTube
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url.includes('youtube.com/watch')) {
        const url = new URL(tabs[0].url);
        const id = url.searchParams.get('v');
        if (id) {
          setVideoUrl(tabs[0].url);
          setVideoId(id);
          setVideoTitle(tabs[0].title.replace(' - YouTube', ''));
        }
      }
    });
  }, []);

  const analyzeVideo = async () => {
    if (!videoId) {
      alert('Please open a YouTube video first!');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      console.log('Analyzing video:', videoId);

      const response = await fetch(`${API_URL}/youtube/analyze`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          videoId: videoId,
          url: videoUrl,
          title: videoTitle,
          description: ''
        })
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
        setActiveTab('summary');
      } else {
        alert('Analysis failed: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error! Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const jumpToTimestamp = (seconds) => {
    // Open YouTube video at specific timestamp
    const timestampUrl = `${videoUrl}&t=${seconds}s`;
    chrome.tabs.update({ url: timestampUrl });
  };

  return (
    <div className="youtube-summary">
      <div className="yt-header">
        <h2>🎥 YouTube Analyzer</h2>
        <p className="yt-subtitle">AI-powered video insights</p>
      </div>

      {videoId ? (
        <div className="current-video">
          <h4>📺 Current Video</h4>
          <div className="video-title">{videoTitle}</div>
          <div className="video-id">ID: {videoId}</div>
          <button 
            className="analyze-btn"
            onClick={analyzeVideo}
            disabled={loading}
          >
            {loading ? '🔄 Analyzing...' : '✨ Analyze Video'}
          </button>
        </div>
      ) : (
        <div className="no-video">
          <p>❌ No YouTube video detected</p>
          <p className="hint">Open a YouTube video and click the extension again</p>
        </div>
      )}

      {result && (
        <div className="results">
          {/* Tab Navigation */}
          <div className="tab-nav">
            <button 
              className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
              onClick={() => setActiveTab('summary')}
            >
              📝 Summary
            </button>
            <button 
              className={`tab-btn ${activeTab === 'chapters' ? 'active' : ''}`}
              onClick={() => setActiveTab('chapters')}
            >
              ⏱️ Chapters ({result.suggestedChapters?.length || 0})
            </button>
          </div>

          {/* Summary Tab */}
          {activeTab === 'summary' && (
            <div className="summary-content">
              <div className="stats-bar">
                <span>ℹ️ AI-generated analysis</span>
                <span>📊 {result.stats?.chaptersGenerated || 0} chapters</span>
              </div>
              <div className="summary-text">
                {result.summary}
              </div>
              {result.note && (
                <div className="note-box">
                  💡 {result.note}
                </div>
              )}
            </div>
          )}

          {/* Chapters Tab */}
          {activeTab === 'chapters' && (
            <div className="chapters-content">
              <h4>🎯 Suggested Chapters/Timestamps</h4>
              {result.suggestedChapters && result.suggestedChapters.length > 0 ? (
                <div className="chapters-list">
                  {result.suggestedChapters.map((chapter, index) => (
                    <div key={index} className="chapter-item">
                      <button 
                        className="timestamp-btn"
                        onClick={() => jumpToTimestamp(chapter.seconds)}
                        title="Click to jump to this timestamp"
                      >
                        {chapter.timestamp}
                      </button>
                      <div className="chapter-text">{chapter.title}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-chapters">
                  <p>No timestamps available</p>
                  <p className="hint">AI couldn't generate chapter suggestions from video metadata</p>
                </div>
              )}
              <div className="chapters-note">
                💡 Timestamps are AI-suggested based on typical video structure. Click any timestamp to jump to that point in the video.
              </div>
            </div>
          )}
        </div>
      )}

      {!result && !loading && videoId && (
        <div className="instructions">
          <h4>How it works:</h4>
          <ol>
            <li>AI analyzes the video title and description</li>
            <li>Generates summary of video content</li>
            <li>Suggests logical chapter timestamps</li>
            <li>Click timestamps to navigate video</li>
          </ol>
          <div className="beta-notice">
            ⚠️ <strong>Note:</strong> This is a metadata-based analysis. For best results, videos should have detailed descriptions.
          </div>
        </div>
      )}
    </div>
  );
}

export default YouTubeSummary;