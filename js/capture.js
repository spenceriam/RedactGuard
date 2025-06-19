// Screenshot Capture Module
// Handles the actual screenshot capture process and coordination

class ScreenshotCapture {
  constructor() {
    this.isCapturing = false;
  }

  // Main capture function called from popup
  async captureScreenshot() {
    if (this.isCapturing) {
      throw new Error('Screenshot capture already in progress');
    }

    this.isCapturing = true;
    
    try {
      // Send message to background script to capture screenshot
      const response = await this.sendMessage({ action: 'captureScreenshot' });
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to capture screenshot');
      }

      // Get additional page information
      const pageInfo = await this.getPageInfo();
      
      // Combine screenshot data with page info
      const captureData = {
        dataUrl: response.dataUrl,
        timestamp: Date.now(),
        pageInfo: pageInfo,
        dimensions: await this.getImageDimensions(response.dataUrl)
      };

      // Store capture data for processing
      await this.storeCaptureData(captureData);
      
      return captureData;
      
    } catch (error) {
      console.error('Screenshot capture failed:', error);
      throw error;
    } finally {
      this.isCapturing = false;
    }
  }

  // Send message to background script
  async sendMessage(message) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
  }

  // Get page information from content script
  async getPageInfo() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      const response = await chrome.tabs.sendMessage(tab.id, { 
        action: 'getPageInfo' 
      });
      
      return response.success ? response.pageInfo : null;
    } catch (error) {
      console.log('Could not get page info:', error.message);
      return null;
    }
  }

  // Get image dimensions from data URL
  async getImageDimensions(dataUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      img.onerror = () => {
        resolve({ width: 0, height: 0 });
      };
      img.src = dataUrl;
    });
  }

  // Store capture data in extension storage
  async storeCaptureData(captureData) {
    try {
      await chrome.storage.local.set({
        lastCapture: captureData
      });
    } catch (error) {
      console.error('Failed to store capture data:', error);
    }
  }

  // Retrieve stored capture data
  async getStoredCaptureData() {
    try {
      const result = await chrome.storage.local.get(['lastCapture']);
      return result.lastCapture || null;
    } catch (error) {
      console.error('Failed to retrieve capture data:', error);
      return null;
    }
  }

  // Clear stored capture data
  async clearCaptureData() {
    try {
      await chrome.storage.local.remove(['lastCapture', 'lastDetectionResults']);
    } catch (error) {
      console.error('Failed to clear capture data:', error);
    }
  }

  // Download screenshot as file
  downloadScreenshot(dataUrl, filename = null) {
    if (!filename) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      filename = `privacy-shield-screenshot-${timestamp}.png`;
    }

    // Create download link
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Validate screenshot data
  isValidScreenshot(dataUrl) {
    return dataUrl && 
           typeof dataUrl === 'string' && 
           dataUrl.startsWith('data:image/png;base64,');
  }
}

// Export for use in popup
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScreenshotCapture;
} else {
  window.ScreenshotCapture = ScreenshotCapture;
}

