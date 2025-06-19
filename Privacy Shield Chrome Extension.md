# Privacy Shield Chrome Extension

## Overview
Privacy Shield is a Chrome extension that automatically detects and redacts sensitive information in screenshots. It features an Apple-like user interface and provides comprehensive privacy protection for various types of sensitive data.

## Features

### 🛡️ Automatic Detection
- **Email addresses** - Detects and redacts email patterns
- **Phone numbers** - Supports various phone number formats
- **Credit card numbers** - Validates using Luhn algorithm
- **Social Security Numbers** - Detects SSN patterns
- **Bank account numbers** - Identifies potential banking information
- **Street addresses** - Recognizes address patterns
- **IP addresses** - Detects IPv4 addresses
- **Driver license numbers** - Identifies license patterns
- **Passport numbers** - Detects passport formats
- **ZIP codes** - Recognizes postal codes

### 🎨 Apple-like Interface
- Clean, minimalist design following Apple's Human Interface Guidelines
- Smooth animations and transitions
- Responsive layout with proper touch targets
- Dark mode support
- Professional color scheme with Apple's signature blue

### 📸 Screenshot Capabilities
- One-click screenshot capture
- Automatic redaction with black boxes
- Download redacted screenshots
- Preview with detection highlights
- Batch processing support

### 📊 Detection Summary
- Real-time detection statistics
- Confidence indicators for each detection
- Categorized results by data type
- Clarification prompts for uncertain detections

## Installation

### For Development
1. Clone or download the extension files
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory
5. The Privacy Shield icon should appear in your toolbar

### For Testing
1. Navigate to the included `test-page.html` file
2. Click the Privacy Shield extension icon
3. Click "Capture Screenshot"
4. Review the detection results and redacted image

## File Structure
```
chrome-extension-project/
├── manifest.json              # Extension configuration
├── popup.html                 # Main popup interface
├── background.js              # Service worker
├── content.js                 # Content script
├── test-page.html             # Test page with sample data
├── css/
│   ├── apple-theme.css        # Apple design system
│   └── popup.css              # Popup-specific styles
├── js/
│   ├── popup.js               # Main popup logic
│   ├── capture.js             # Screenshot capture
│   ├── detector.js            # Sensitive data detection
│   └── redactor.js            # Image redaction
├── icons/
│   ├── icon16.png             # Extension icons
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── design-references/
    ├── apple-design-guide.md  # Design documentation
    └── *.png                  # Reference images
```

## Technical Implementation

### Detection Algorithms
- **Pattern Matching**: Uses regular expressions for initial detection
- **Validation**: Implements specific validation for credit cards (Luhn), SSNs, etc.
- **Confidence Scoring**: Assigns confidence levels to reduce false positives
- **OCR Simulation**: Simulates text extraction from images

### Image Processing
- **Canvas Manipulation**: Uses HTML5 Canvas for image processing
- **Redaction Boxes**: Applies rounded black rectangles over sensitive areas
- **Preview Mode**: Shows highlighted areas before redaction
- **Export Options**: Supports PNG format with high quality

### Privacy & Security
- **Local Processing**: All detection happens locally in the browser
- **No Data Transmission**: Sensitive information never leaves the user's device
- **Temporary Storage**: Uses Chrome's local storage for session data only
- **Automatic Cleanup**: Clears data when navigating to new pages

## Browser Permissions
- `activeTab`: Access to current tab for screenshot capture
- `storage`: Local storage for session data
- `downloads`: File download capability
- `scripting`: Content script injection

## Supported Data Types

| Type | Pattern | Validation | Confidence |
|------|---------|------------|------------|
| Email | RFC-compliant regex | Format validation | High |
| Phone | US/International formats | Length validation | High |
| Credit Card | Major card types | Luhn algorithm | High |
| SSN | XXX-XX-XXXX format | Invalid pattern check | High |
| Bank Account | 8-17 digits | Length validation | Medium |
| Address | Street patterns | Context validation | Medium |
| ZIP Code | US format | Format validation | Medium |
| IP Address | IPv4 format | Range validation | Medium |
| Passport | Alphanumeric patterns | Format validation | Low |
| Driver License | State patterns | Format validation | Low |

## Design Philosophy
The extension follows Apple's design principles:
- **Clarity**: Clean, readable interface with purposeful use of space
- **Deference**: Content takes priority over interface elements
- **Depth**: Visual layers and realistic motion provide hierarchy

## Future Enhancements
- Real OCR integration (Tesseract.js)
- Additional data type detection
- Batch screenshot processing
- Custom redaction patterns
- Export to multiple formats
- Integration with cloud storage

## Browser Compatibility
- Chrome 88+ (Manifest V3 support)
- Chromium-based browsers
- Edge 88+

## License
This extension is provided as-is for educational and privacy protection purposes.

## Support
For issues or questions, please refer to the test page and documentation included with the extension.

