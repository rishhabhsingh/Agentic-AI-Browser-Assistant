// Content Script - Runs on every webpage

console.log('🎯 BrowserBuddy AI Content Script loaded on:', window.location.href);

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  if (request.action === 'getPageContent') {
    const content = {
      title: document.title,
      url: window.location.href,
      text: document.body.innerText.substring(0, 5000) // First 5000 chars
    };
    sendResponse(content);
  }
  
  if (request.action === 'highlightText') {
    // We'll implement this in Day 3
    sendResponse({ status: 'Feature coming soon!' });
  }
});

// Check if we're on YouTube
if (window.location.hostname.includes('youtube.com')) {
  console.log('🎥 YouTube detected! Special features available.');
}