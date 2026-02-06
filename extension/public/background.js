// Background Service Worker for BrowserBuddy AI

console.log('🤖 BrowserBuddy AI Background Service Worker loaded!');

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('✅ BrowserBuddy AI installed successfully!');
  
  // Set default settings
  chrome.storage.local.set({
    settings: {
      autoCleanTabs: false,
      simplificationLevel: 'medium',
      theme: 'dark'
    }
  });
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('📨 Message received:', request);
  
  if (request.action === 'getTabs') {
    chrome.tabs.query({}, (tabs) => {
      sendResponse({ tabs });
    });
    return true; // Required for async response
  }
  
  if (request.action === 'ping') {
    sendResponse({ status: 'ok', message: 'Background service is running!' });
  }
});

// Example: Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    console.log('Tab loaded:', tab.title);
  }
});