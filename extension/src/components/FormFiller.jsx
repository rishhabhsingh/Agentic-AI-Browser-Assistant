import { useState, useEffect } from 'react';
import './FormFiller.css';

const API_URL = 'https://agentic-ai-browser-assistant.onrender.com';

function FormFiller() {
  const [view, setView] = useState('main'); // main, profile, fill
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    professional: {
      currentTitle: '',
      company: '',
      linkedIn: '',
      github: '',
      portfolio: ''
    },
    education: {
      degree: '',
      major: '',
      university: '',
      graduationYear: '',
      gpa: ''
    }
  });
  const [detectingFields, setDetectingFields] = useState(false);
  const [detectedFields, setDetectedFields] = useState([]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/formfill/get-profile?userId=default_user`);
      const data = await response.json();
      
      if (data.success && data.profile) {
        setProfile(data.profile);
        setFormData({
          personalInfo: data.profile.personalInfo || formData.personalInfo,
          professional: data.profile.professional || formData.professional,
          education: data.profile.education || formData.education
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const saveProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/formfill/save-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'default_user',
          profile: formData
        })
      });

      const data = await response.json();

      if (data.success) {
        setProfile(data.profile);
        alert('✅ Profile saved successfully!');
        setView('main');
      } else {
        alert('Failed to save profile');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving profile!');
    }
  };

  const detectAndFillForm = async () => {
    setDetectingFields(true);

    try {
      // Get form fields from current page
      chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: 'detectFormFields' },
          async (response) => {
            if (chrome.runtime.lastError) {
              alert('Error: Please refresh the page first!');
              setDetectingFields(false);
              return;
            }

            if (!response || !response.fields || response.fields.length === 0) {
              alert('No form fields detected on this page!');
              setDetectingFields(false);
              return;
            }

            console.log('Detected fields:', response.fields);
            setDetectedFields(response.fields);

            // Match fields with AI
            const matchResponse = await fetch(`${API_URL}/formfill/match-fields`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fields: response.fields,
                userId: 'default_user'
              })
            });

            const matchData = await matchResponse.json();

            if (matchData.success && matchData.matches.length > 0) {
              // Fill the form
              chrome.tabs.sendMessage(
                tabs[0].id,
                {
                  action: 'fillForm',
                  matches: matchData.matches
                },
                (fillResponse) => {
                  setDetectingFields(false);
                  if (fillResponse && fillResponse.success) {
                    alert(`✅ Filled ${matchData.matchedCount} fields!`);
                  }
                }
              );
            } else {
              alert('Could not match any fields. Make sure your profile is complete!');
              setDetectingFields(false);
            }
          }
        );
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Error detecting form!');
      setDetectingFields(false);
    }
  };

  const updateField = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  if (view === 'profile') {
    return (
      <div className="form-filler">
        <div className="ff-header">
          <button className="back-btn-small" onClick={() => setView('main')}>←</button>
          <h2>📝 Edit Profile</h2>
        </div>

        <div className="profile-form">
          <div className="form-section">
            <h4>Personal Info</h4>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.personalInfo.fullName}
              onChange={(e) => updateField('personalInfo', 'fullName', e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.personalInfo.email}
              onChange={(e) => updateField('personalInfo', 'email', e.target.value)}
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formData.personalInfo.phone}
              onChange={(e) => updateField('personalInfo', 'phone', e.target.value)}
            />
            <input
              type="text"
              placeholder="Address"
              value={formData.personalInfo.address}
              onChange={(e) => updateField('personalInfo', 'address', e.target.value)}
            />
            <div className="form-row">
              <input
                type="text"
                placeholder="City"
                value={formData.personalInfo.city}
                onChange={(e) => updateField('personalInfo', 'city', e.target.value)}
              />
              <input
                type="text"
                placeholder="State"
                value={formData.personalInfo.state}
                onChange={(e) => updateField('personalInfo', 'state', e.target.value)}
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                placeholder="ZIP Code"
                value={formData.personalInfo.zipCode}
                onChange={(e) => updateField('personalInfo', 'zipCode', e.target.value)}
              />
              <input
                type="text"
                placeholder="Country"
                value={formData.personalInfo.country}
                onChange={(e) => updateField('personalInfo', 'country', e.target.value)}
              />
            </div>
          </div>

          <div className="form-section">
            <h4>Professional</h4>
            <input
              type="text"
              placeholder="Current Title"
              value={formData.professional.currentTitle}
              onChange={(e) => updateField('professional', 'currentTitle', e.target.value)}
            />
            <input
              type="text"
              placeholder="Company"
              value={formData.professional.company}
              onChange={(e) => updateField('professional', 'company', e.target.value)}
            />
            <input
              type="url"
              placeholder="LinkedIn URL"
              value={formData.professional.linkedIn}
              onChange={(e) => updateField('professional', 'linkedIn', e.target.value)}
            />
            <input
              type="url"
              placeholder="GitHub URL"
              value={formData.professional.github}
              onChange={(e) => updateField('professional', 'github', e.target.value)}
            />
            <input
              type="url"
              placeholder="Portfolio URL"
              value={formData.professional.portfolio}
              onChange={(e) => updateField('professional', 'portfolio', e.target.value)}
            />
          </div>

          <div className="form-section">
            <h4>Education</h4>
            <input
              type="text"
              placeholder="Degree (e.g., B.Tech)"
              value={formData.education.degree}
              onChange={(e) => updateField('education', 'degree', e.target.value)}
            />
            <input
              type="text"
              placeholder="Major (e.g., Computer Science)"
              value={formData.education.major}
              onChange={(e) => updateField('education', 'major', e.target.value)}
            />
            <input
              type="text"
              placeholder="University"
              value={formData.education.university}
              onChange={(e) => updateField('education', 'university', e.target.value)}
            />
            <div className="form-row">
              <input
                type="text"
                placeholder="Graduation Year"
                value={formData.education.graduationYear}
                onChange={(e) => updateField('education', 'graduationYear', e.target.value)}
              />
              <input
                type="text"
                placeholder="GPA"
                value={formData.education.gpa}
                onChange={(e) => updateField('education', 'gpa', e.target.value)}
              />
            </div>
          </div>

          <button className="save-btn" onClick={saveProfile}>
            💾 Save Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-filler">
      <div className="ff-header">
        <h2>📝 Auto Form Filler</h2>
        <p className="ff-subtitle">Fill forms instantly with AI</p>
      </div>

      {profile ? (
        <>
          <div className="profile-summary">
            <h4>Your Profile</h4>
            <div className="profile-info">
              <p><strong>Name:</strong> {profile.personalInfo?.fullName || 'Not set'}</p>
              <p><strong>Email:</strong> {profile.personalInfo?.email || 'Not set'}</p>
              <p><strong>Phone:</strong> {profile.personalInfo?.phone || 'Not set'}</p>
            </div>
            <button className="edit-btn" onClick={() => setView('profile')}>
              ✏️ Edit Profile
            </button>
          </div>

          <div className="ff-actions">
            <button
              className="fill-btn"
              onClick={detectAndFillForm}
              disabled={detectingFields}
            >
              {detectingFields ? '🔄 Detecting...' : '✨ Fill Current Form'}
            </button>
          </div>

          <div className="instructions">
            <h4>How to use:</h4>
            <ol>
              <li>Navigate to any form (Google Forms, job application, etc.)</li>
              <li>Click "Fill Current Form"</li>
              <li>AI will automatically fill matching fields!</li>
            </ol>
          </div>
        </>
      ) : (
        <div className="no-profile">
          <p>📋 No profile found</p>
          <p className="hint">Create your profile to enable auto-fill</p>
          <button className="create-btn" onClick={() => setView('profile')}>
            ➕ Create Profile
          </button>
        </div>
      )}
    </div>
  );
}

export default FormFiller;