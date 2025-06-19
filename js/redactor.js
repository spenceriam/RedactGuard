// Image Redaction Module
// Handles applying black box redaction over sensitive areas in screenshots

class ImageRedactor {
  constructor() {
    this.redactionColor = '#000000'; // Black
    this.redactionOpacity = 1.0; // Fully opaque
    this.borderRadius = 4; // Rounded corners for redaction boxes
    this.padding = 2; // Extra padding around detected areas
  }

  // Main redaction function
  async redactImage(imageDataUrl, detections) {
    try {
      // Create canvas from image
      const canvas = await this.createCanvasFromImage(imageDataUrl);
      const ctx = canvas.getContext('2d');
      
      // Apply redaction boxes
      const redactedAreas = this.applyRedactionBoxes(ctx, detections);
      
      // Get redacted image data
      const redactedDataUrl = canvas.toDataURL('image/png', 1.0);
      
      return {
        redactedImageUrl: redactedDataUrl,
        originalImageUrl: imageDataUrl,
        redactedAreas: redactedAreas,
        redactionCount: redactedAreas.length,
        timestamp: Date.now()
      };
      
    } catch (error) {
      console.error('Image redaction failed:', error);
      throw error;
    }
  }

  // Create canvas from image data URL
  async createCanvasFromImage(imageDataUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions to match image
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        
        // Draw original image onto canvas
        ctx.drawImage(img, 0, 0);
        
        resolve(canvas);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image for redaction'));
      };
      
      img.src = imageDataUrl;
    });
  }

  // Apply black boxes over detected sensitive areas
  applyRedactionBoxes(ctx, detections) {
    const redactedAreas = [];
    
    detections.forEach((detection, index) => {
      if (detection.area) {
        const redactionArea = this.calculateRedactionArea(detection.area);
        
        // Draw redaction box
        this.drawRedactionBox(ctx, redactionArea);
        
        redactedAreas.push({
          id: detection.id,
          type: detection.type,
          description: detection.description,
          area: redactionArea,
          originalArea: detection.area
        });
      }
    });
    
    return redactedAreas;
  }

  // Calculate redaction area with padding
  calculateRedactionArea(originalArea) {
    return {
      x: Math.max(0, originalArea.x - this.padding),
      y: Math.max(0, originalArea.y - this.padding),
      width: originalArea.width + (this.padding * 2),
      height: originalArea.height + (this.padding * 2)
    };
  }

  // Draw a single redaction box
  drawRedactionBox(ctx, area) {
    ctx.save();
    
    // Set redaction style
    ctx.fillStyle = this.redactionColor;
    ctx.globalAlpha = this.redactionOpacity;
    
    // Draw rounded rectangle
    this.drawRoundedRect(ctx, area.x, area.y, area.width, area.height, this.borderRadius);
    
    ctx.restore();
  }

  // Draw rounded rectangle
  drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  }

  // Create preview with highlighted areas (before redaction)
  async createPreviewWithHighlights(imageDataUrl, detections) {
    try {
      const canvas = await this.createCanvasFromImage(imageDataUrl);
      const ctx = canvas.getContext('2d');
      
      // Draw highlight boxes
      detections.forEach(detection => {
        if (detection.area) {
          this.drawHighlightBox(ctx, detection.area, detection.type);
        }
      });
      
      return canvas.toDataURL('image/png', 1.0);
      
    } catch (error) {
      console.error('Preview creation failed:', error);
      throw error;
    }
  }

  // Draw highlight box (for preview)
  drawHighlightBox(ctx, area, type) {
    ctx.save();
    
    // Set highlight color based on detection type
    const highlightColor = this.getHighlightColor(type);
    
    // Draw border
    ctx.strokeStyle = highlightColor;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(area.x, area.y, area.width, area.height);
    
    // Draw semi-transparent overlay
    ctx.fillStyle = highlightColor;
    ctx.globalAlpha = 0.2;
    ctx.fillRect(area.x, area.y, area.width, area.height);
    
    ctx.restore();
  }

  // Get highlight color based on detection type
  getHighlightColor(type) {
    const colors = {
      email: '#FF3B30',      // Red
      phone: '#FF9500',      // Orange
      creditCard: '#FF3B30', // Red
      ssn: '#FF3B30',        // Red
      bankAccount: '#FF3B30', // Red
      address: '#FF9500',    // Orange
      zipCode: '#FFCC00',    // Yellow
      ipAddress: '#34C759',  // Green
      passport: '#FF3B30',   // Red
      driverLicense: '#FF9500' // Orange
    };
    
    return colors[type] || '#007AFF'; // Default blue
  }

  // Batch redaction for multiple images
  async redactMultipleImages(imageDataUrls, detectionsArray) {
    const results = [];
    
    for (let i = 0; i < imageDataUrls.length; i++) {
      try {
        const result = await this.redactImage(imageDataUrls[i], detectionsArray[i] || []);
        results.push(result);
      } catch (error) {
        console.error(`Failed to redact image ${i}:`, error);
        results.push({
          error: error.message,
          originalImageUrl: imageDataUrls[i]
        });
      }
    }
    
    return results;
  }

  // Undo redaction (return to original)
  undoRedaction(originalImageUrl) {
    return {
      redactedImageUrl: originalImageUrl,
      originalImageUrl: originalImageUrl,
      redactedAreas: [],
      redactionCount: 0,
      timestamp: Date.now()
    };
  }

  // Selective redaction (redact only specific types)
  async selectiveRedaction(imageDataUrl, detections, typesToRedact) {
    const filteredDetections = detections.filter(detection => 
      typesToRedact.includes(detection.type)
    );
    
    return this.redactImage(imageDataUrl, filteredDetections);
  }

  // Get redaction statistics
  getRedactionStats(redactedAreas) {
    const stats = {
      totalRedacted: redactedAreas.length,
      byType: {},
      totalArea: 0,
      averageArea: 0
    };

    redactedAreas.forEach(area => {
      // Count by type
      stats.byType[area.type] = (stats.byType[area.type] || 0) + 1;
      
      // Calculate total area
      stats.totalArea += area.area.width * area.area.height;
    });

    // Calculate average area
    if (redactedAreas.length > 0) {
      stats.averageArea = stats.totalArea / redactedAreas.length;
    }

    return stats;
  }

  // Export redacted image as blob
  async exportAsBlob(canvas, format = 'image/png', quality = 1.0) {
    return new Promise((resolve) => {
      canvas.toBlob(resolve, format, quality);
    });
  }

  // Validate redaction parameters
  validateRedactionParams(detections) {
    if (!Array.isArray(detections)) {
      throw new Error('Detections must be an array');
    }

    detections.forEach((detection, index) => {
      if (!detection.area) {
        console.warn(`Detection ${index} missing area information`);
      }
      
      if (detection.area && (
        typeof detection.area.x !== 'number' ||
        typeof detection.area.y !== 'number' ||
        typeof detection.area.width !== 'number' ||
        typeof detection.area.height !== 'number'
      )) {
        throw new Error(`Invalid area coordinates for detection ${index}`);
      }
    });

    return true;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImageRedactor;
} else {
  window.ImageRedactor = ImageRedactor;
}

