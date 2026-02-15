import { useState } from 'react';
import './ResumeOptimizer.css';

const API_URL = 'https://browser-buddy-backend.onrender.com/api';

function ResumeOptimizer() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [optimizing, setOptimizing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const optimizeResume = async (generateTemplate = false) => {
    if (!jobDescription.trim()) {
      alert('Please provide a job description!');
      return;
    }

    if (!generateTemplate && !resumeText.trim()) {
      alert('Please provide your resume text!');
      return;
    }

    const setLoading = generateTemplate ? setGenerating : setOptimizing;
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/resume/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription: jobDescription,
          resumeText: resumeText || 'Generate new resume',
          generateTemplate: generateTemplate
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
      setLoading(false);
    }
  };

  const downloadResume = () => {
    if (result && result.downloadUrl) {
      const fullUrl = API_URL.replace('/api', '') + result.downloadUrl;
      window.open(fullUrl, '_blank');
    } else {
      alert('No resume file available. Click "Generate Template" first!');
    }
  };

  const reset = () => {
    setResult(null);
    setJobDescription('');
    setResumeText('');
  };

  return (
    <div className="resume-optimizer">
      <div className="ro-header">
        <h2>📄 Resume Optimizer</h2>
        <p className="ro-subtitle">ATS-friendly resume with AI</p>
      </div>

      {!result ? (
        <div className="ro-input">
          <div className="input-section">
            <h4>📋 Job Description *</h4>
            <p className="input-hint">Paste the complete job posting</p>
            <textarea
              placeholder="Paste job description here... (e.g., We are looking for a Software Engineer with experience in...)"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows="8"
            />
          </div>

          <div className="input-section">
            <h4>📝 Your Current Resume (Optional)</h4>
            <p className="input-hint">Paste your resume to analyze, or leave empty to generate template</p>
            <textarea
              placeholder="Paste your current resume text here... (optional)"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows="8"
            />
          </div>

          <div className="ro-actions">
            {resumeText.trim() ? (
              <button
                className="optimize-btn"
                onClick={() => optimizeResume(false)}
                disabled={optimizing || generating}
              >
                {optimizing ? '🔄 Analyzing...' : '🔍 Analyze My Resume'}
              </button>
            ) : null}

            <button
              className="generate-btn"
              onClick={() => optimizeResume(true)}
              disabled={optimizing || generating}
            >
              {generating ? '🔄 Generating...' : '✨ Generate ATS Template'}
            </button>
          </div>

          <div className="ro-info">
            <h4>💡 What this does:</h4>
            <ul>
              <li>✅ Extracts keywords from job description</li>
              <li>✅ Calculates your match score</li>
              <li>✅ Provides improvement suggestions</li>
              <li>✅ Generates ATS-friendly .docx template</li>
              <li>✅ Highlights missing keywords</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="ro-result">
          <div className="result-header">
            <h4>✅ Analysis Complete!</h4>
            <button className="reset-btn" onClick={reset}>🔄 New Analysis</button>
          </div>

          <div className="match-score">
            <h4>Match Score</h4>
            <div className={`score-circle ${result.matchScore >= 70 ? 'good' : result.matchScore >= 50 ? 'medium' : 'low'}`}>
              <span className="score">{result.matchScore}%</span>
              <span className="score-label">
                {result.matchScore >= 70 ? 'Great!' : result.matchScore >= 50 ? 'Good' : 'Needs Work'}
              </span>
            </div>
          </div>

          <div className="keywords-section">
            <div className="matched-keywords">
              <h4>✅ Matched Keywords ({result.matchedKeywords?.length})</h4>
              <div className="keyword-tags">
                {result.matchedKeywords?.map((kw, i) => (
                  <span key={i} className="keyword-tag matched">{kw}</span>
                ))}
              </div>
            </div>

            <div className="missing-keywords">
              <h4>⚠️ Missing Keywords ({result.missingKeywords?.length})</h4>
              <div className="keyword-tags">
                {result.missingKeywords?.map((kw, i) => (
                  <span key={i} className="keyword-tag missing">{kw}</span>
                ))}
              </div>
              <p className="hint">💡 Add these keywords to your resume!</p>
            </div>
          </div>

          <div className="suggestions">
            <h4>💡 AI Improvement Suggestions</h4>
            <div className="suggestion-text">
              {result.suggestions}
            </div>
          </div>

          {result.downloadUrl && (
            <div className="download-section">
              <div className="download-info">
                <h4>📥 Your ATS-Friendly Resume Template</h4>
                <p>✨ Professional format optimized for Applicant Tracking Systems</p>
                <p className="file-name">📄 {result.fileName}</p>
              </div>
              <button className="download-btn" onClick={downloadResume}>
                📥 Download Resume (.docx)
              </button>
              <p className="download-hint">
                ℹ️ Open in Microsoft Word or Google Docs to edit
              </p>
            </div>
          )}

          {!result.downloadUrl && (
            <div className="no-template">
              <p>💡 Want an ATS-friendly template?</p>
              <button className="generate-btn" onClick={() => optimizeResume(true)}>
                ✨ Generate Template Now
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ResumeOptimizer;