// Background Service Worker
// Handles screenshot capture and communication between popup and content scripts

chrome.runtime.onInstalled.addListener(() => {
  console.log('Privacy Shield extension installed');
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'captureScreenshot') {
    captureCurrentTab()
      .then(dataUrl => {
        sendResponse({ success: true, dataUrl });
      })
      .catch(error => {
        console.error('Screenshot capture failed:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep message channel open for async response
  }
});

// Capture screenshot of the current active tab
async function captureCurrentTab() {
  try {
    // Get the current active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
      throw new Error('No active tab found');
    }

    // Capture visible area of the tab
    const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, {
      format: 'png',
      quality: 100
    });

    // Store the screenshot data
    await chrome.storage.local.set({
      lastScreenshot: {
        dataUrl,
        timestamp: Date.now(),
        tabUrl: tab.url,
        tabTitle: tab.title
      }
    });

    return dataUrl;
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    throw error;
  }
}

// Handle tab updates to clear old screenshot data
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    // Clear old screenshot when navigating to new page
    chrome.storage.local.remove(['lastScreenshot', 'lastDetectionResults']);
  }
});

// Utility function to inject content script if needed
async function ensureContentScript(tabId) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content.js']
    });
  } catch (error) {
    // Content script might already be injected
    console.log('Content script injection skipped:', error.message);
  }
}

