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
});

function enableReadingMode(fontSize, theme) {
  if (readingModeActive) return;

  // Save original content
  originalContent = {
    bodyHTML: document.body.innerHTML,
    bodyStyle: document.body.style.cssText,
    htmlStyle: document.documentElement.style.cssText
  };

  // Find main content
  const article = document.querySelector('article') || 
                  document.querySelector('[role="main"]') || 
                  document.querySelector('main') ||
                  document.querySelector('.post-content') ||
                  document.querySelector('.article-content') ||
                  document.querySelector('.entry-content') ||
                  document.querySelector('#content');

  if (!article) {
    alert('Could not find main content on this page. Try a different page.');
    return;
  }

  // Extract content
  const title = document.querySelector('h1') || document.querySelector('title');
  const titleText = title ? title.textContent : '';

  // Create reading mode container
  const container = document.createElement('div');
  container.id = 'reading-mode-container';
  container.innerHTML = `
    <div class="reading-mode-header">
      <h1>${titleText}</h1>
      <button id="exit-reading-mode">✕ Exit Reading Mode</button>
    </div>
    <div class="reading-mode-content">
      ${article.innerHTML}
    </div>
  `;

  // Clear body and add container
  document.body.innerHTML = '';
  document.body.appendChild(container);

  // Apply styles
  const bgColor = theme === 'dark' ? '#1a1a1a' : '#ffffff';
  const textColor = theme === 'dark' ? '#e0e0e0' : '#333333';

  const style = document.createElement('style');
  style.id = 'reading-mode-styles';
  style.textContent = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      background: ${bgColor} !important;
      color: ${textColor} !important;
      font-family: Georgia, 'Times New Roman', serif !important;
      line-height: 1.8 !important;
      overflow-y: auto !important;
    }
    
    #reading-mode-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    
    .reading-mode-header {
      margin-bottom: 40px;
      border-bottom: 2px solid ${theme === 'dark' ? '#333' : '#ddd'};
      padding-bottom: 20px;
    }
    
    .reading-mode-header h1 {
      font-size: ${fontSize + 8}px !important;
      margin-bottom: 20px;
      color: ${textColor} !important;
    }
    
    #exit-reading-mode {
      background: ${theme === 'dark' ? '#333' : '#f0f0f0'};
      color: ${textColor};
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
    }
    
    #exit-reading-mode:hover {
      background: ${theme === 'dark' ? '#444' : '#e0e0e0'};
    }
    
    .reading-mode-content {
      font-size: ${fontSize}px !important;
      color: ${textColor} !important;
    }
    
    .reading-mode-content p {
      margin-bottom: 1.5em !important;
      line-height: 1.8 !important;
    }
    
    .reading-mode-content h2,
    .reading-mode-content h3,
    .reading-mode-content h4 {
      margin-top: 2em !important;
      margin-bottom: 1em !important;
      color: ${textColor} !important;
    }
    
    .reading-mode-content img {
      max-width: 100% !important;
      height: auto !important;
      margin: 2em 0 !important;
    }
    
    .reading-mode-content a {
      color: ${theme === 'dark' ? '#6db3f2' : '#0066cc'} !important;
      text-decoration: underline;
    }
    
    .reading-mode-content blockquote {
      border-left: 4px solid ${theme === 'dark' ? '#555' : '#ccc'};
      padding-left: 20px;
      margin: 1.5em 0;
      font-style: italic;
    }
  `;
  
  document.head.appendChild(style);

  // Add exit button handler
  document.getElementById('exit-reading-mode').addEventListener('click', disableReadingMode);

  readingModeActive = true;
  console.log('✅ Reading mode enabled');
}

function disableReadingMode() {
  if (!readingModeActive || !originalContent) return;

  // Remove styles
  const styles = document.getElementById('reading-mode-styles');
  if (styles) styles.remove();

  // Restore original content
  document.body.innerHTML = originalContent.bodyHTML;
  document.body.style.cssText = originalContent.bodyStyle;
  document.documentElement.style.cssText = originalContent.htmlStyle;

  readingModeActive = false;
  originalContent = null;
  console.log('✅ Reading mode disabled');
}

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