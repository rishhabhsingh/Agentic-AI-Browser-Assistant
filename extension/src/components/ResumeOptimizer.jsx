import { useState } from 'react';
import './ResumeOptimizer.css';

const API_URL = 'http://localhost:5000/api';

function ResumeOptimizer() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [optimizing, setOptimizing] = useState(false);
  const [result, setResult] = useState(null);

  const optimizeResume = async () => {
    if (!jobDescription.trim() || !resumeText.trim()) {
      alert('Please provide both job description and resume!');
      return;
    }

    setOptimizing(true);
    try {
      const response = await fetch(`${API_URL}/resume/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription: jobDescription,
          resumeText: resumeText
        })
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        alert('Failed: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error! Make sure backend is running.');
    } finally {
      setOptimizing(false);
    }
  };

  const downloadDocx = () => {
    if (result && result.downloadUrl) {
      window.open(result.downloadUrl, '_blank');
    }
  };

  return (
    <div className="resume-optimizer">
      <div className="ro-header">
        <h2>📄 Resume Optimizer</h2>
        <p className="ro-subtitle">ATS-friendly resume creation</p>
      </div>

      {!result ? (
        <div className="ro-input">
          <div className="input-section">
            <h4>📋 Job Description</h4>
            <textarea
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows="6"
            />
          </div>

          <div className="input-section">
            <h4>📝 Your Current Resume</h4>
            <textarea
              placeholder="Paste your resume text here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows="8"
            />
          </div>

          <button
            className="optimize-btn"
            onClick={optimizeResume}
            disabled={optimizing}
          >
            {optimizing ? '🔄 Optimizing...' : '✨ Optimize Resume'}
          </button>

          <div className="ro-info">
            <h4>What this does:</h4>
            <ul>
              <li>✅ Matches keywords from job description</li>
              <li>✅ Creates ATS-friendly format</li>
              <li>✅ Suggests improvements</li>
              <li>✅ Generates downloadable .docx</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="ro-result">
          <div className="result-header">
            <h4>✅ Optimization Complete!</h4>
            <button onClick={() => setResult(null)}>← New Resume</button>
          </div>

          <div className="match-score">
            <h4>Match Score</h4>
            <div className="score-circle">
              <span className="score">{result.matchScore}%</span>
            </div>
          </div>

          <div className="suggestions">
            <h4>💡 AI Suggestions</h4>
            <div className="suggestion-text">
              {result.suggestions}
            </div>
          </div>

          <div className="keywords">
            <h4>🎯 Matched Keywords</h4>
            <div className="keyword-tags">
              {result.keywords?.map((kw, i) => (
                <span key={i} className="keyword-tag">{kw}</span>
              ))}
            </div>
          </div>

          <div className="download-section">
            <button className="download-btn" onClick={downloadDocx}>
              📥 Download Optimized Resume (.docx)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeOptimizer;