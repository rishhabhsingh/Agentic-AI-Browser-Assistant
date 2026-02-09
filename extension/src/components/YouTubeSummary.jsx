import { useState, useEffect } from 'react';
import './YouTubeSummary.css';

const API_URL = 'http://localhost:5000/api';

function YouTubeSummary() {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('summary'); // summary, transcript, moments

  useEffect(() => {
    // Check if current tab is YouTube
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url.includes('youtube.com/watch')) {
        const url = new URL(tabs[0].url);
        const id = url.searchParams.get('v');
        if (id) {
          setVideoUrl(tabs[0].url);
          setVideoId(id);
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
          url: videoUrl
        })
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
        setActiveTab('summary');
      } else {
        alert('Failed: ' + (data.message || 'Could not analyze video'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error! Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const copyTranscript = () => {
    if (result && result.transcript) {
      navigator.clipboard.writeText(result.transcript.formatted);
      alert('✅ Transcript copied to clipboard!');
    }
  };

  const jumpToTimestamp = (seconds) => {
    // This would need to interact with the YouTube player
    // For now, just show the timestamp
    alert(`Jump to ${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`);
  };

  return (
    <div className="youtube-summary">
      <div className="yt-header">
        <h2>🎥 YouTube Summary</h2>
        <p className="yt-subtitle">Get AI-powered video summaries</p>
      </div>

      {/* Current Video */}
      {videoId ? (
        <div className="current-video">
          <h4>📺 Current Video</h4>
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

      {/* Results */}
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
              className={`tab-btn ${activeTab === 'transcript' ? 'active' : ''}`}
              onClick={() => setActiveTab('transcript')}
            >
              📄 Transcript
            </button>
            <button 
              className={`tab-btn ${activeTab === 'moments' ? 'active' : ''}`}
              onClick={() => setActiveTab('moments')}
            >
              ⏱️ Key Moments
            </button>
          </div>

          {/* Summary Tab */}
          {activeTab === 'summary' && (
            <div className="summary-content">
              <div className="stats-bar">
                <span>📊 {result.stats.segmentCount} segments</span>
                <span>⏱️ ~{result.stats.estimatedDuration} min</span>
              </div>
              <div className="summary-text">
                {result.summary}
              </div>
            </div>
          )}

          {/* Transcript Tab */}
          {activeTab === 'transcript' && (
            <div className="transcript-content">
              <div className="transcript-header">
                <h4>Full Transcript</h4>
                <button className="copy-btn" onClick={copyTranscript}>
                  📋 Copy
                </button>
              </div>
              <div className="transcript-text">
                {result.transcript.formatted}
              </div>
            </div>
          )}

          {/* Key Moments Tab */}
          {activeTab === 'moments' && (
            <div className="moments-content">
              <h4>🎯 Key Moments</h4>
              <div className="moments-list">
                {result.keyMoments.map((moment, index) => (
                  <div key={index} className="moment-item">
                    <button 
                      className="timestamp-btn"
                      onClick={() => jumpToTimestamp(moment.timestamp)}
                    >
                      {moment.formatted}
                    </button>
                    <div className="moment-text">{moment.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      {!result && !loading && videoId && (
        <div className="instructions">
          <h4>How it works:</h4>
          <ol>
            <li>Make sure video has captions/subtitles</li>
            <li>Click "Analyze Video"</li>
            <li>Get instant AI summary + transcript</li>
          </ol>
        </div>
      )}
    </div>
  );
}

export default YouTubeSummary;