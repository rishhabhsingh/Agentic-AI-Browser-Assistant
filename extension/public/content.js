// Content Script - Runs on every webpage
console.log('🎯 BrowserBuddy AI Content Script loaded on:', window.location.href);

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('📨 Content script received message:', request.action);
  
  try {
    if (request.action === 'getPageContent') {
      console.log('📄 Getting page content...');
      
      const content = {
        title: document.title,
        url: window.location.href,
        text: document.body.innerText.substring(0, 5000)
      };
      
      console.log('✅ Page content extracted:', content.text.length, 'chars');
      sendResponse(content);
      return true; // Keep channel open for async
    }
    
    if (request.action === 'getSelection') {
      console.log('📝 Getting selected text...');
      
      const selectedText = window.getSelection().toString().trim();
      console.log('✅ Selected text:', selectedText.length, 'chars');
      
      sendResponse({ 
        text: selectedText,
        url: window.location.href
      });
      return true;
    }
    
    if (request.action === 'highlightText') {
      console.log('🎨 Highlight feature coming soon!');
      sendResponse({ status: 'Feature coming soon!' });
      return true;
    }

    // ✅ NEW: Reading Mode
    if (request.action === 'toggleReadingMode') {
      console.log('📖 Toggling reading mode...');
      toggleReadingMode(request.fontSize, request.darkMode);
      sendResponse({ success: true });
      return true;
    }
    
    // ✅ NEW: Update Reading Mode
    if (request.action === 'updateReadingMode') {
      console.log('📖 Updating reading mode settings...');
      updateReadingModeSettings(request.fontSize, request.darkMode);
      sendResponse({ success: true });
      return true;
    }
    
    if (request.action === 'highlightText') {
      console.log('🎨 Highlight feature coming soon!');
      sendResponse({ status: 'Feature coming soon!' });
      return true;
    }
    
    // Unknown action
    console.warn('⚠️ Unknown action:', request.action);
    sendResponse({ error: 'Unknown action' });
    return true;
    
  } catch (error) {
    console.error('❌ Content script error:', error);
    sendResponse({ error: error.message });
    return true;
  }
});

// Check if we're on YouTube
if (window.location.hostname.includes('youtube.com')) {
  console.log('🎥 YouTube detected! Special features available.');
}

console.log('✅ Content script ready and listening for messages')

// ============================================
// READING MODE FUNCTIONS
// ============================================

let readingModeActive = false;
let originalHTML = '';

function toggleReadingMode(fontSize, darkMode) {
  if (!readingModeActive) {
    enableReadingMode(fontSize, darkMode);
  } else {
    disableReadingMode();
  }
}

function enableReadingMode(fontSize, darkMode) {
  console.log('📖 Enabling reading mode...');
  
  // Save original HTML
  originalHTML = document.body.innerHTML;
  
  // Extract main content
  const mainContent = extractMainContent();
  
  if (!mainContent) {
    alert('Could not extract main content from this page!');
    return;
  }
  
  // Create reading mode container
  const container = document.createElement('div');
  container.id = 'browserbuddy-reading-mode';
  container.innerHTML = `
    <div class="reading-mode-header">
      <h1>${document.title}</h1>
      <button id="exit-reading-mode">✕ Exit Reading Mode</button>
    </div>
    <div class="reading-mode-content">
      ${mainContent}
    </div>
  `;
  
  // Apply styles
  applyReadingModeStyles(fontSize, darkMode);
  
  // Replace body content
  document.body.innerHTML = '';
  document.body.appendChild(container);
  
  // Add exit button listener
  document.getElementById('exit-reading-mode').addEventListener('click', disableReadingMode);
  
  readingModeActive = true;
  console.log('✅ Reading mode enabled');
}

function disableReadingMode() {
  console.log('📖 Disabling reading mode...');
  
  // Remove reading mode styles
  const style = document.getElementById('browserbuddy-rm-styles');
  if (style) style.remove();
  
  // Restore original HTML
  document.body.innerHTML = originalHTML;
  
  readingModeActive = false;
  console.log('✅ Reading mode disabled');
}

function updateReadingModeSettings(fontSize, darkMode) {
  if (readingModeActive) {
    applyReadingModeStyles(fontSize, darkMode);
  }
}

function extractMainContent() {
  // Try to find main content
  let content = null;
  
  // Common selectors for main content
  const selectors = [
    'article',
    'main',
    '[role="main"]',
    '.post-content',
    '.article-content',
    '.entry-content',
    '.content',
    '#content',
    '.mw-parser-output' // Wikipedia
  ];
  
  for (const selector of selectors) {
    content = document.querySelector(selector);
    if (content && content.innerText.length > 500) {
      return content.innerHTML;
    }
  }
  
  // Fallback: get all paragraphs
  const paragraphs = Array.from(document.querySelectorAll('p'));
  if (paragraphs.length > 5) {
    return paragraphs.map(p => p.outerHTML).join('');
  }
  
  return null;
}

function applyReadingModeStyles(fontSize, darkMode) {
  // Remove existing styles if any
  const existing = document.getElementById('browserbuddy-rm-styles');
  if (existing) existing.remove();
  
  const style = document.createElement('style');
  style.id = 'browserbuddy-rm-styles';
  
  const bgColor = darkMode ? '#1a1a1a' : '#ffffff';
  const textColor = darkMode ? '#e0e0e0' : '#333333';
  const headerBg = darkMode ? '#2a2a2a' : '#f5f5f5';
  
  style.textContent = `
    #browserbuddy-reading-mode {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${bgColor};
      color: ${textColor};
      overflow-y: auto;
      z-index: 999999;
      font-family: Georgia, 'Times New Roman', serif;
    }
    
    .reading-mode-header {
      position: sticky;
      top: 0;
      background: ${headerBg};
      padding: 20px;
      border-bottom: 1px solid ${darkMode ? '#333' : '#ddd'};
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 1000000;
    }
    
    .reading-mode-header h1 {
      margin: 0;
      font-size: 24px;
      color: ${textColor};
      flex: 1;
    }
    
    #exit-reading-mode {
      padding: 10px 20px;
      background: #e74c3c;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    #exit-reading-mode:hover {
      background: #c0392b;
      transform: scale(1.05);
    }
    
    .reading-mode-content {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      line-height: 1.8;
      font-size: ${fontSize}px;
    }
    
    .reading-mode-content p {
      margin-bottom: 1.5em;
      line-height: 1.8;
    }
    
    .reading-mode-content h1,
    .reading-mode-content h2,
    .reading-mode-content h3 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      color: ${textColor};
    }
    
    .reading-mode-content a {
      color: ${darkMode ? '#64b5f6' : '#2980b9'};
      text-decoration: none;
      border-bottom: 1px solid currentColor;
    }
    
    .reading-mode-content img {
      max-width: 100%;
      height: auto;
      margin: 20px 0;
      border-radius: 8px;
    }
    
    .reading-mode-content blockquote {
      border-left: 4px solid ${darkMode ? '#555' : '#ddd'};
      padding-left: 20px;
      margin: 20px 0;
      font-style: italic;
      opacity: 0.9;
    }
    
    /* Hide ads and other junk */
    .reading-mode-content [class*="ad"],
    .reading-mode-content [id*="ad"],
    .reading-mode-content iframe,
    .reading-mode-content .sidebar,
    .reading-mode-content nav {
      display: none !important;
    }
  `;
  
  document.head.appendChild(style);
}

// ============================================
// FORM FILLING FUNCTIONS
// ============================================

// Detect form fields on page
function detectFormFields() {
  const fields = [];
  
  // Get all input fields
  const inputs = document.querySelectorAll('input, textarea, select');
  
  inputs.forEach((input, index) => {
    // Skip hidden, submit, button types
    if (input.type === 'hidden' || input.type === 'submit' || input.type === 'button') {
      return;
    }
    
    // Get field info
    const field = {
      index: index,
      type: input.type || input.tagName.toLowerCase(),
      name: input.name || '',
      id: input.id || '',
      placeholder: input.placeholder || '',
      label: getFieldLabel(input),
      value: input.value || ''
    };
    
    fields.push(field);
  });
  
  return fields;
}

// Get label for input field
function getFieldLabel(input) {
  // Try to find associated label
  if (input.id) {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (label) return label.innerText.trim();
  }
  
  // Try parent label
  const parentLabel = input.closest('label');
  if (parentLabel) return parentLabel.innerText.trim();
  
  // Try previous sibling label
  let prev = input.previousElementSibling;
  if (prev && prev.tagName === 'LABEL') {
    return prev.innerText.trim();
  }
  
  // Fallback to placeholder or name
  return input.placeholder || input.name || 'Unknown';
}

// Fill form with matched data
function fillFormFields(matches) {
  let filledCount = 0;
  
  const inputs = document.querySelectorAll('input, textarea, select');
  
  matches.forEach(match => {
    const input = inputs[match.fieldIndex];
    
    if (input && match.value) {
      // Set value
      input.value = match.value;
      
      // Trigger change event (for React forms, etc.)
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      
      // Visual feedback
      input.style.backgroundColor = 'rgba(39, 174, 96, 0.2)';
      setTimeout(() => {
        input.style.backgroundColor = '';
      }, 1000);
      
      filledCount++;
    }
  });
  
  return filledCount;
}

// Listen for form fill messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // ... existing code ...
  
  if (request.action === 'detectFormFields') {
    console.log('📝 Detecting form fields...');
    const fields = detectFormFields();
    console.log(`✅ Detected ${fields.length} fields`);
    sendResponse({ success: true, fields: fields });
    return true;
  }
  
  if (request.action === 'fillForm') {
    console.log('✍️ Filling form...');
    const filledCount = fillFormFields(request.matches);
    console.log(`✅ Filled ${filledCount} fields`);
    sendResponse({ success: true, filledCount: filledCount });
    return true;
  }
  
  // ... rest of existing code ...
});