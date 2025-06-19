// Sensitive Data Detection Module
// Detects various types of sensitive information using pattern matching and OCR

class SensitiveDataDetector {
  constructor() {
    this.patterns = this.initializePatterns();
    this.confidence = {
      HIGH: 0.9,
      MEDIUM: 0.7,
      LOW: 0.5
    };
  }

  // Initialize detection patterns
  initializePatterns() {
    return {
      email: {
        pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        type: 'email',
        description: 'Email Address',
        confidence: this.confidence.HIGH
      },
      
      phone: {
        // Matches various phone number formats
        pattern: /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g,
        type: 'phone',
        description: 'Phone Number',
        confidence: this.confidence.HIGH
      },
      
      creditCard: {
        // Matches major credit card formats (Visa, MasterCard, Amex, Discover)
        pattern: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3[0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b/g,
        type: 'creditCard',
        description: 'Credit Card Number',
        confidence: this.confidence.HIGH
      },
      
      ssn: {
        // Social Security Number
        pattern: /\b(?!000|666|9\d{2})\d{3}-?(?!00)\d{2}-?(?!0000)\d{4}\b/g,
        type: 'ssn',
        description: 'Social Security Number',
        confidence: this.confidence.HIGH
      },
      
      bankAccount: {
        // Bank account numbers (8-17 digits)
        pattern: /\b\d{8,17}\b/g,
        type: 'bankAccount',
        description: 'Potential Bank Account',
        confidence: this.confidence.MEDIUM
      },
      
      address: {
        // Street addresses
        pattern: /\b\d+\s+[A-Za-z0-9\s,.-]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Place|Pl)\b/gi,
        type: 'address',
        description: 'Street Address',
        confidence: this.confidence.MEDIUM
      },
      
      zipCode: {
        // US ZIP codes
        pattern: /\b\d{5}(?:-\d{4})?\b/g,
        type: 'zipCode',
        description: 'ZIP Code',
        confidence: this.confidence.MEDIUM
      },
      
      ipAddress: {
        // IP addresses
        pattern: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
        type: 'ipAddress',
        description: 'IP Address',
        confidence: this.confidence.MEDIUM
      },
      
      passport: {
        // US Passport numbers
        pattern: /\b[A-Z]{1,2}\d{6,9}\b/g,
        type: 'passport',
        description: 'Potential Passport Number',
        confidence: this.confidence.LOW
      },
      
      driverLicense: {
        // Driver's license patterns (varies by state)
        pattern: /\b[A-Z]{1,2}\d{6,8}\b/g,
        type: 'driverLicense',
        description: 'Potential Driver License',
        confidence: this.confidence.LOW
      }
    };
  }

  // Main detection function
  async detectSensitiveData(imageDataUrl) {
    try {
      // Extract text from image using OCR
      const extractedText = await this.extractTextFromImage(imageDataUrl);
      
      // Detect patterns in extracted text
      const detections = this.detectPatterns(extractedText);
      
      // Filter and validate detections
      const validDetections = this.validateDetections(detections);
      
      // Calculate detection areas (approximate positions)
      const detectionsWithAreas = await this.calculateDetectionAreas(validDetections, imageDataUrl);
      
      return {
        detections: detectionsWithAreas,
        totalCount: detectionsWithAreas.length,
        extractedText: extractedText,
        timestamp: Date.now()
      };
      
    } catch (error) {
      console.error('Detection failed:', error);
      throw error;
    }
  }

  // Extract text from image using Canvas OCR simulation
  async extractTextFromImage(imageDataUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas for image processing
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // For demo purposes, we'll simulate OCR with some sample text
        // In a real implementation, you would use a library like Tesseract.js
        const simulatedText = this.generateSimulatedOCRText();
        
        resolve(simulatedText);
      };
      img.src = imageDataUrl;
    });
  }

  // Generate simulated OCR text for demonstration
  generateSimulatedOCRText() {
    // This simulates text that might be found in a screenshot
    return `
      Contact Information:
      Email: john.doe@example.com
      Phone: (555) 123-4567
      Address: 123 Main Street, Anytown, CA 90210
      
      Payment Details:
      Credit Card: 4532 1234 5678 9012
      Expiry: 12/25
      CVV: 123
      
      Personal Information:
      SSN: 123-45-6789
      Driver License: D1234567
      
      Banking:
      Account: 1234567890123456
      Routing: 021000021
      
      Additional:
      IP Address: 192.168.1.1
      Passport: AB1234567
    `;
  }

  // Detect patterns in text
  detectPatterns(text) {
    const detections = [];
    
    Object.entries(this.patterns).forEach(([key, patternInfo]) => {
      const matches = text.match(patternInfo.pattern);
      
      if (matches) {
        matches.forEach(match => {
          // Find position of match in text
          const index = text.indexOf(match);
          
          detections.push({
            type: patternInfo.type,
            description: patternInfo.description,
            value: match,
            confidence: patternInfo.confidence,
            textIndex: index,
            length: match.length,
            id: this.generateDetectionId()
          });
        });
      }
    });
    
    return detections;
  }

  // Validate detections to reduce false positives
  validateDetections(detections) {
    return detections.filter(detection => {
      switch (detection.type) {
        case 'creditCard':
          return this.validateCreditCard(detection.value);
        case 'ssn':
          return this.validateSSN(detection.value);
        case 'email':
          return this.validateEmail(detection.value);
        case 'phone':
          return this.validatePhone(detection.value);
        default:
          return true;
      }
    });
  }

  // Credit card validation using Luhn algorithm
  validateCreditCard(cardNumber) {
    const cleaned = cardNumber.replace(/\D/g, '');
    if (cleaned.length < 13 || cleaned.length > 19) return false;
    
    let sum = 0;
    let isEven = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  }

  // SSN validation
  validateSSN(ssn) {
    const cleaned = ssn.replace(/\D/g, '');
    if (cleaned.length !== 9) return false;
    
    // Check for invalid patterns
    const invalid = ['000000000', '111111111', '222222222', '333333333', 
                    '444444444', '555555555', '666666666', '777777777', 
                    '888888888', '999999999'];
    
    return !invalid.includes(cleaned);
  }

  // Email validation
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Phone validation
  validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 || cleaned.length === 11;
  }

  // Calculate approximate detection areas in image
  async calculateDetectionAreas(detections, imageDataUrl) {
    const imageDimensions = await this.getImageDimensions(imageDataUrl);
    
    return detections.map((detection, index) => {
      // Simulate text positioning (in real implementation, use OCR coordinates)
      const area = this.simulateTextArea(index, imageDimensions);
      
      return {
        ...detection,
        area: area
      };
    });
  }

  // Simulate text area positioning
  simulateTextArea(index, imageDimensions) {
    const { width, height } = imageDimensions;
    
    // Distribute detections across the image
    const cols = 2;
    const rows = Math.ceil(index / cols) + 1;
    
    const cellWidth = width / cols;
    const cellHeight = height / (rows + 1);
    
    const col = index % cols;
    const row = Math.floor(index / cols);
    
    return {
      x: col * cellWidth + 20,
      y: row * cellHeight + 50,
      width: Math.min(200, cellWidth - 40),
      height: 20
    };
  }

  // Get image dimensions
  async getImageDimensions(imageDataUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      img.src = imageDataUrl;
    });
  }

  // Generate unique detection ID
  generateDetectionId() {
    return 'det_' + Math.random().toString(36).substr(2, 9);
  }

  // Get detection statistics
  getDetectionStats(detections) {
    const stats = {
      total: detections.length,
      byType: {},
      byConfidence: {
        high: 0,
        medium: 0,
        low: 0
      }
    };

    detections.forEach(detection => {
      // Count by type
      stats.byType[detection.type] = (stats.byType[detection.type] || 0) + 1;
      
      // Count by confidence
      if (detection.confidence >= this.confidence.HIGH) {
        stats.byConfidence.high++;
      } else if (detection.confidence >= this.confidence.MEDIUM) {
        stats.byConfidence.medium++;
      } else {
        stats.byConfidence.low++;
      }
    });

    return stats;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SensitiveDataDetector;
} else {
  window.SensitiveDataDetector = SensitiveDataDetector;
}

