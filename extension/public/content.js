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

console.log('✅ Content script ready and listening for messages');