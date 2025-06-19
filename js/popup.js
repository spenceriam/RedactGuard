// Main Popup JavaScript
// Coordinates all extension functionality with Apple-like interactions

class PrivacyShieldPopup {
  constructor() {
    this.screenshotCapture = new ScreenshotCapture();
    this.sensitiveDataDetector = new SensitiveDataDetector();
    this.imageRedactor = new ImageRedactor();
    
    this.currentScreenshot = null;
    this.currentDetections = null;
    this.currentRedactedImage = null;
    
    this.initializeEventListeners();
    this.loadPreviousSession();
  }

  // Initialize all event listeners
  initializeEventListeners() {
    // Capture button
    const captureBtn = document.getElementById('captureBtn');
    if (captureBtn) {
      captureBtn.addEventListener('click', () => this.handleCaptureClick());
    }

    // Download button
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => this.handleDownloadClick());
    }

    // Retry button
    const retryBtn = document.getElementById('retryBtn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => this.handleRetryClick());
    }

    // Add smooth transitions to all interactive elements
    this.addInteractionEffects();
  }

  // Handle capture button click
  async handleCaptureClick() {
    try {
      this.showLoadingState();
      
      // Capture screenshot
      const captureData = await this.screenshotCapture.captureScreenshot();
      this.currentScreenshot = captureData;
      
      // Detect sensitive information
      const detectionResults = await this.sensitiveDataDetector.detectSensitiveData(captureData.dataUrl);
      this.currentDetections = detectionResults.detections;
      
      // Apply redaction
      const redactionResults = await this.imageRedactor.redactImage(
        captureData.dataUrl, 
        this.currentDetections
      );
      this.currentRedactedImage = redactionResults;
      
      // Display results
      this.displayResults(redactionResults, detectionResults);
      
    } catch (error) {
      console.error('Capture process failed:', error);
      this.showErrorState(error.message);
    }
  }

  // Handle download button click
  handleDownloadClick() {
    if (this.currentRedactedImage) {
      this.screenshotCapture.downloadScreenshot(
        this.currentRedactedImage.redactedImageUrl,
        this.generateFileName()
      );
      
      // Show success feedback
      this.showDownloadFeedback();
    }
  }

  // Handle retry button click
  handleRetryClick() {
    this.resetToInitialState();
  }

  // Show loading state
  showLoadingState() {
    this.hideAllSections();
    const loadingSection = document.getElementById('loadingSection');
    if (loadingSection) {
      loadingSection.classList.remove('hidden');
      loadingSection.classList.add('fade-in');
    }
  }

  // Show error state
  showErrorState(message) {
    this.hideAllSections();
    const errorSection = document.getElementById('errorSection');
    const errorMessage = document.getElementById('errorMessage');
    
    if (errorSection && errorMessage) {
      errorMessage.textContent = message;
      errorSection.classList.remove('hidden');
      errorSection.classList.add('fade-in');
    }
  }

  // Display results
  displayResults(redactionResults, detectionResults) {
    this.hideAllSections();
    
    // Show results section
    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) {
      resultsSection.classList.remove('hidden');
      resultsSection.classList.add('fade-in');
    }
    
    // Update screenshot preview
    this.updateScreenshotPreview(redactionResults.redactedImageUrl);
    
    // Update detection summary
    this.updateDetectionSummary(detectionResults.detections, redactionResults.redactedAreas);
    
    // Update detection details
    this.updateDetectionDetails(detectionResults.detections);
    
    // Check for clarifications needed
    this.updateClarificationSection(detectionResults.detections);
  }

  // Update screenshot preview
  updateScreenshotPreview(imageUrl) {
    const screenshotImg = document.getElementById('screenshotImg');
    if (screenshotImg) {
      screenshotImg.src = imageUrl;
      screenshotImg.classList.add('fade-in');
    }
  }

  // Update detection summary
  updateDetectionSummary(detections, redactedAreas) {
    const detectedCount = document.getElementById('detectedCount');
    const redactedCount = document.getElementById('redactedCount');
    
    if (detectedCount) {
      detectedCount.textContent = detections.length;
      this.animateNumber(detectedCount, 0, detections.length);
    }
    
    if (redactedCount) {
      redactedCount.textContent = redactedAreas.length;
      this.animateNumber(redactedCount, 0, redactedAreas.length);
    }
  }

  // Update detection details
  updateDetectionDetails(detections) {
    const detectionList = document.getElementById('detectionList');
    if (!detectionList) return;
    
    detectionList.innerHTML = '';
    
    if (detections.length === 0) {
      const noDetections = document.createElement('div');
      noDetections.className = 'detection-item';
      noDetections.innerHTML = `
        <div class="detection-type-icon" style="background-color: var(--color-success);">✓</div>
        <div class="detection-info">
          <div class="detection-type">No sensitive data detected</div>
          <div class="detection-value">Your screenshot appears to be safe</div>
        </div>
      `;
      detectionList.appendChild(noDetections);
      return;
    }
    
    detections.forEach((detection, index) => {
      const detectionItem = this.createDetectionItem(detection, index);
      detectionList.appendChild(detectionItem);
    });
  }

  // Create detection item element
  createDetectionItem(detection, index) {
    const item = document.createElement('div');
    item.className = 'detection-item slide-in';
    item.style.animationDelay = `${index * 0.1}s`;
    
    const iconColor = this.getDetectionIconColor(detection.type);
    const iconSymbol = this.getDetectionIconSymbol(detection.type);
    const maskedValue = this.maskSensitiveValue(detection.value, detection.type);
    
    item.innerHTML = `
      <div class="detection-type-icon" style="background-color: ${iconColor};">
        ${iconSymbol}
      </div>
      <div class="detection-info">
        <div class="detection-type">${detection.description}</div>
        <div class="detection-value">${maskedValue}</div>
      </div>
      <div class="confidence-indicator">
        ${this.createConfidenceIndicator(detection.confidence)}
      </div>
    `;
    
    return item;
  }

  // Get detection icon color
  getDetectionIconColor(type) {
    const colors = {
      email: '#FF3B30',
      phone: '#FF9500',
      creditCard: '#FF3B30',
      ssn: '#FF3B30',
      bankAccount: '#FF3B30',
      address: '#FF9500',
      zipCode: '#FFCC00',
      ipAddress: '#34C759',
      passport: '#FF3B30',
      driverLicense: '#FF9500'
    };
    return colors[type] || '#007AFF';
  }

  // Get detection icon symbol
  getDetectionIconSymbol(type) {
    const symbols = {
      email: '✉️',
      phone: '📞',
      creditCard: '💳',
      ssn: '🆔',
      bankAccount: '🏦',
      address: '🏠',
      zipCode: '📮',
      ipAddress: '🌐',
      passport: '📘',
      driverLicense: '🚗'
    };
    return symbols[type] || '🔒';
  }

  // Mask sensitive values for display
  maskSensitiveValue(value, type) {
    switch (type) {
      case 'creditCard':
        return value.replace(/\d(?=\d{4})/g, '*');
      case 'ssn':
        return value.replace(/\d(?=\d{4})/g, '*');
      case 'phone':
        return value.replace(/\d(?=\d{4})/g, '*');
      case 'email':
        const [local, domain] = value.split('@');
        return `${local.charAt(0)}***@${domain}`;
      default:
        return value.length > 10 ? value.substring(0, 6) + '***' : value;
    }
  }

  // Create confidence indicator
  createConfidenceIndicator(confidence) {
    const dots = 3;
    const activeDots = Math.ceil(confidence * dots);
    
    let dotsHtml = '<div class="confidence-dots">';
    for (let i = 0; i < dots; i++) {
      const activeClass = i < activeDots ? 'active' : '';
      dotsHtml += `<div class="confidence-dot ${activeClass}"></div>`;
    }
    dotsHtml += '</div>';
    
    return dotsHtml;
  }

  // Update clarification section
  updateClarificationSection(detections) {
    const clarificationSection = document.getElementById('clarificationSection');
    const clarificationList = document.getElementById('clarificationList');
    
    if (!clarificationSection || !clarificationList) return;
    
    // Find low-confidence detections that need clarification
    const needsClarification = detections.filter(d => d.confidence < 0.7);
    
    if (needsClarification.length > 0) {
      clarificationSection.classList.remove('hidden');
      clarificationList.innerHTML = '';
      
      needsClarification.forEach(detection => {
        const item = document.createElement('div');
        item.className = 'clarification-item';
        item.innerHTML = `
          <span>Is "${this.maskSensitiveValue(detection.value, detection.type)}" sensitive?</span>
          <button class="secondary-button" style="margin-left: auto; padding: 4px 12px; min-height: 32px;">
            Review
          </button>
        `;
        clarificationList.appendChild(item);
      });
    } else {
      clarificationSection.classList.add('hidden');
    }
  }

  // Animate number counting
  animateNumber(element, start, end, duration = 1000) {
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const current = Math.floor(start + (end - start) * this.easeOutCubic(progress));
      element.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  // Easing function
  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // Add interaction effects
  addInteractionEffects() {
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-1px)';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
      });
    });
  }

  // Show download feedback
  showDownloadFeedback() {
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
      const originalText = downloadBtn.innerHTML;
      downloadBtn.innerHTML = '<span class="button-icon">✓</span><span class="button-text">Downloaded</span>';
      downloadBtn.style.backgroundColor = 'var(--color-success)';
      downloadBtn.style.color = 'white';
      
      setTimeout(() => {
        downloadBtn.innerHTML = originalText;
        downloadBtn.style.backgroundColor = '';
        downloadBtn.style.color = '';
      }, 2000);
    }
  }

  // Generate filename for download
  generateFileName() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `privacy-shield-${timestamp}.png`;
  }

  // Hide all sections
  hideAllSections() {
    const sections = ['resultsSection', 'loadingSection', 'errorSection'];
    sections.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.classList.add('hidden');
        section.classList.remove('fade-in', 'slide-in');
      }
    });
  }

  // Reset to initial state
  resetToInitialState() {
    this.hideAllSections();
    this.currentScreenshot = null;
    this.currentDetections = null;
    this.currentRedactedImage = null;
  }

  // Load previous session data
  async loadPreviousSession() {
    try {
      const captureData = await this.screenshotCapture.getStoredCaptureData();
      if (captureData && this.isRecentCapture(captureData.timestamp)) {
        // Auto-load recent capture if available
        console.log('Previous session data found');
      }
    } catch (error) {
      console.log('No previous session data');
    }
  }

  // Check if capture is recent (within 5 minutes)
  isRecentCapture(timestamp) {
    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() - timestamp < fiveMinutes;
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PrivacyShieldPopup();
});

