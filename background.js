// Background service worker for Markdown Editor Chrome Extension

// When the extension icon is clicked, open fullscreen.html in a new tab
chrome.action.onClicked.addListener((tab) => {
  // Check if the clicked tab is already the markdown editor
  if (tab.url && tab.url.includes('fullscreen.html')) {
    // If already on the editor, just focus the tab
    chrome.tabs.update(tab.id, { active: true });
  } else {
    // Open the fullscreen editor in a new tab
    chrome.tabs.create({
      url: chrome.runtime.getURL('fullscreen.html')
    });
  }
});

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Markdown Editor extension installed');
});

// Optional: Handle messages from content scripts or other parts of the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openEditor') {
    chrome.tabs.create({
      url: chrome.runtime.getURL('fullscreen.html')
    });
    sendResponse({ success: true });
  }
});
