// Background service worker for Markdown Editor Chrome Extension

// When the extension icon is clicked, open fullscreen.html in a new tab
chrome.action.onClicked.addListener((tab) => {
  // Open the fullscreen editor in a new tab
  chrome.tabs.create({
    url: chrome.runtime.getURL('fullscreen.html')
  });
});

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Markdown Editor extension installed');
});
