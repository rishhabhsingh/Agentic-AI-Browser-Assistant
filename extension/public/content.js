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

// ==================== READING MODE ====================
let readingModeActive = false;
let originalContent = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'enableReadingMode') {
    enableReadingMode(request.fontSize, request.theme);
    sendResponse({ success: true });
    return true;
  }
  
  if (request.action === 'disableReadingMode') {
    disableReadingMode();
    sendResponse({ success: true });
    return true;
  }
  
  if (request.action === 'getSelection') {
    const selectedText = window.getSelection().toString().trim();
    sendResponse({ 
      text: selectedText,
      url: window.location.href
    });
    return true;
  }
  
  if (request.action === 'getPageContent') {
    const content = {
      title: document.title,
      url: window.location.href,
      text: document.body.innerText.substring(0, 5000)
    };
    sendResponse(content);
    return true;
  }
});

function enableReadingMode(fontSize, theme) {
  if (readingModeActive) return;

  // Save original state
  originalContent = {
    bodyHTML: document.body.innerHTML,
    bodyStyle: document.body.style.cssText,
    htmlStyle: document.documentElement.style.cssText
  };

  // Find main content with priority order
  let article = 
    document.querySelector('article') ||
    document.querySelector('[role="main"]') ||
    document.querySelector('main') ||
    document.querySelector('.post-content') ||
    document.querySelector('.article-content') ||
    document.querySelector('.entry-content') ||
    document.querySelector('.content') ||
    document.querySelector('#content');

  if (!article) {
    // Fallback: Find largest text container
    const candidates = document.querySelectorAll('div, section');
    let largest = null;
    let maxLength = 0;
    
    candidates.forEach(el => {
      const text = el.innerText || '';
      if (text.length > maxLength && text.length > 500) {
        maxLength = text.length;
        largest = el;
      }
    });
    
    article = largest;
  }

  if (!article) {
    alert('Could not find main content on this page. Try a different page.');
    return;
  }

  // Extract title
  const titleElement = document.querySelector('h1') || document.querySelector('title');
  const titleText = titleElement ? titleElement.textContent.trim() : document.title;

  // Theme colors
  const themes = {
    light: {
      bg: '#f8f9fa',
      text: '#2c3e50',
      secondary: '#7f8c8d',
      border: '#e0e0e0',
      button: '#3498db',
      buttonHover: '#2980b9'
    },
    dark: {
      bg: '#1a1a1a',
      text: '#e0e0e0',
      secondary: '#b0b0b0',
      border: '#333333',
      button: '#3498db',
      buttonHover: '#5dade2'
    }
  };

  const colors = themes[theme] || themes.light;

  // Create reading mode container
  const container = document.createElement('div');
  container.id = 'browserbuddy-reading-mode';
  container.innerHTML = `
    <div class="reading-header">
      <h1>${titleText}</h1>
      <button id="exit-reading-mode">✕ Exit Reading Mode</button>
    </div>
    <div class="reading-content">
      ${article.innerHTML}
    </div>
  `;

  // Clear body
  document.body.innerHTML = '';
  document.body.appendChild(container);

  // Apply styles via style tag (more reliable than inline)
  const styleElement = document.createElement('style');
  styleElement.id = 'browserbuddy-reading-styles';
  styleElement.textContent = `
    /* Reset everything */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    /* Body styles */
    body {
      background: ${colors.bg} !important;
      color: ${colors.text} !important;
      font-family: 'Georgia', 'Times New Roman', serif !important;
      line-height: 1.8 !important;
      overflow-y: auto !important;
      padding: 0 !important;
      margin: 0 !important;
    }
    
    /* Container */
    #browserbuddy-reading-mode {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      min-height: 100vh;
    }
    
    /* Header */
    .reading-header {
      margin-bottom: 40px;
      border-bottom: 2px solid ${colors.border};
      padding-bottom: 20px;
      position: sticky;
      top: 0;
      background: ${colors.bg};
      z-index: 1000;
      padding-top: 20px;
    }
    
    .reading-header h1 {
      font-size: ${fontSize + 8}px !important;
      margin-bottom: 20px !important;
      color: ${colors.text} !important;
      font-weight: 700 !important;
      line-height: 1.3 !important;
    }
    
    /* Exit button */
    #exit-reading-mode {
      background: ${colors.button} !important;
      color: white !important;
      border: none !important;
      padding: 12px 24px !important;
      border-radius: 6px !important;
      cursor: pointer !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      transition: all 0.3s ease !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
    }
    
    #exit-reading-mode:hover {
      background: ${colors.buttonHover} !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    
    /* Content area */
    .reading-content {
      font-size: ${fontSize}px !important;
      color: ${colors.text} !important;
    }
    
    /* Paragraphs */
    .reading-content p {
      margin-bottom: 1.5em !important;
      line-height: 1.8 !important;
      color: ${colors.text} !important;
    }
    
    /* Headings */
    .reading-content h2,
    .reading-content h3,
    .reading-content h4,
    .reading-content h5,
    .reading-content h6 {
      margin-top: 2em !important;
      margin-bottom: 1em !important;
      color: ${colors.text} !important;
      font-weight: 700 !important;
      line-height: 1.3 !important;
    }
    
    .reading-content h2 { font-size: ${fontSize + 6}px !important; }
    .reading-content h3 { font-size: ${fontSize + 4}px !important; }
    .reading-content h4 { font-size: ${fontSize + 2}px !important; }
    
    /* Links */
    .reading-content a {
      color: ${colors.button} !important;
      text-decoration: underline !important;
      word-break: break-word !important;
    }
    
    .reading-content a:hover {
      color: ${colors.buttonHover} !important;
    }
    
    /* Lists */
    .reading-content ul,
    .reading-content ol {
      margin-left: 2em !important;
      margin-bottom: 1.5em !important;
    }
    
    .reading-content li {
      margin-bottom: 0.5em !important;
      line-height: 1.8 !important;
    }
    
    /* Images */
    .reading-content img {
      max-width: 100% !important;
      height: auto !important;
      margin: 2em 0 !important;
      display: block !important;
      border-radius: 8px !important;
    }
    
    /* Blockquotes */
    .reading-content blockquote {
      border-left: 4px solid ${colors.border} !important;
      padding-left: 20px !important;
      margin: 1.5em 0 !important;
      font-style: italic !important;
      color: ${colors.secondary} !important;
    }
    
    /* Code blocks */
    .reading-content pre,
    .reading-content code {
      background: ${theme === 'dark' ? '#2a2a2a' : '#f5f5f5'} !important;
      padding: 2px 6px !important;
      border-radius: 3px !important;
      font-family: 'Courier New', monospace !important;
      font-size: ${fontSize - 2}px !important;
    }
    
    .reading-content pre {
      padding: 15px !important;
      overflow-x: auto !important;
      margin: 1.5em 0 !important;
    }
    
    /* Tables */
    .reading-content table {
      width: 100% !important;
      border-collapse: collapse !important;
      margin: 2em 0 !important;
    }
    
    .reading-content th,
    .reading-content td {
      border: 1px solid ${colors.border} !important;
      padding: 12px !important;
      text-align: left !important;
    }
    
    .reading-content th {
      background: ${theme === 'dark' ? '#2a2a2a' : '#f5f5f5'} !important;
      font-weight: 700 !important;
    }
    
    /* Remove unwanted elements */
    .reading-content iframe,
    .reading-content .ad,
    .reading-content .advertisement,
    .reading-content .social-share,
    .reading-content .comments,
    .reading-content nav,
    .reading-content aside {
      display: none !important;
    }
  `;

  document.head.appendChild(styleElement);

  // Add exit button handler
  document.getElementById('exit-reading-mode').addEventListener('click', disableReadingMode);

  readingModeActive = true;
  console.log('✅ BrowserBuddy Reading Mode enabled');
}

function disableReadingMode() {
  if (!readingModeActive || !originalContent) return;

  // Remove styles
  const styles = document.getElementById('browserbuddy-reading-styles');
  if (styles) styles.remove();

  // Restore original content
  document.body.innerHTML = originalContent.bodyHTML;
  document.body.style.cssText = originalContent.bodyStyle;
  document.documentElement.style.cssText = originalContent.htmlStyle;

  readingModeActive = false;
  originalContent = null;
  console.log('✅ BrowserBuddy Reading Mode disabled');
}

console.log('🎯 BrowserBuddy AI Content Script loaded');

// ============================================
// FORM FILLING FUNCTIONS (FIXED VERSION)
// ============================================

// Detect form fields on page - IMPROVED
function detectFormFields() {
  console.log('🔍 Starting form field detection...');
  const fields = [];
  
  // Get all input fields including those in shadow DOM
  const inputs = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea, select');
  
  console.log(`Found ${inputs.length} potential form fields`);
  
  inputs.forEach((input, index) => {
    // Skip if not visible
    if (input.offsetParent === null && input.type !== 'hidden') {
      return;
    }
    
    const field = {
      index: index,
      type: input.type || input.tagName.toLowerCase(),
      name: input.name || '',
      id: input.id || '',
      placeholder: input.placeholder || '',
      label: getFieldLabel(input),
      value: input.value || '',
      required: input.required || false,
      autocomplete: input.autocomplete || ''
    };
    
    console.log(`Field ${index}:`, field.label || field.placeholder || field.name);
    fields.push(field);
  });
  
  console.log(`✅ Total fields detected: ${fields.length}`);
  return fields;
}

// Get label for input field - IMPROVED
function getFieldLabel(input) {
  // Try aria-label first
  if (input.getAttribute('aria-label')) {
    return input.getAttribute('aria-label');
  }
  
  // Try associated label by ID
  if (input.id) {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (label) return label.innerText.trim();
  }
  
  // Try parent label
  const parentLabel = input.closest('label');
  if (parentLabel) {
    const text = parentLabel.innerText.trim();
    if (text) return text;
  }
  
  // Try previous sibling label
  let prev = input.previousElementSibling;
  while (prev) {
    if (prev.tagName === 'LABEL') {
      return prev.innerText.trim();
    }
    if (prev.tagName === 'SPAN' || prev.tagName === 'DIV') {
      const text = prev.innerText.trim();
      if (text && text.length < 100) return text;
    }
    prev = prev.previousElementSibling;
  }
  
  // Try parent's previous sibling (common in form layouts)
  const parent = input.parentElement;
  if (parent) {
    const parentPrev = parent.previousElementSibling;
    if (parentPrev && (parentPrev.tagName === 'LABEL' || parentPrev.tagName === 'DIV')) {
      const text = parentPrev.innerText.trim();
      if (text && text.length < 100) return text;
    }
  }
  
  // Fallback to placeholder, name, or autocomplete
  return input.placeholder || input.name || input.autocomplete || 'Unknown Field';
}

// Fill form with matched data - IMPROVED
function fillFormFields(matches) {
  console.log('✍️ Starting to fill form...', matches);
  let filledCount = 0;
  
  const inputs = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea, select');
  
  matches.forEach(match => {
    const input = inputs[match.fieldIndex];
    
    if (input && match.value) {
      console.log(`Filling field ${match.fieldIndex}: ${match.value}`);
      
      // Set value
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      ).set;
      nativeInputValueSetter.call(input, match.value);
      
      // Trigger all necessary events for React/Angular/Vue forms
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      input.dispatchEvent(new Event('blur', { bubbles: true }));
      
      // Visual feedback
      const originalBg = input.style.backgroundColor;
      input.style.backgroundColor = 'rgba(39, 174, 96, 0.2)';
      input.style.transition = 'background-color 0.3s ease';
      
      setTimeout(() => {
        input.style.backgroundColor = originalBg;
      }, 1500);
      
      filledCount++;
    }
  });
  
  console.log(`✅ Filled ${filledCount} fields`);
  return filledCount;
}

// UPDATE THE MESSAGE LISTENER
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
      return true;
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
    
    if (request.action === 'toggleReadingMode') {
      console.log('📖 Toggling reading mode...');
      toggleReadingMode(request.fontSize, request.darkMode);
      sendResponse({ success: true });
      return true;
    }
    
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

console.log('✅ Content script ready and listening for messages');

// Rest of the reading mode code stays the same...