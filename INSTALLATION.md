# Privacy Shield Chrome Extension - Installation Guide

## 🛡️ Quick Start

### Installation Steps
1. **Download the Extension**
   - Download the `privacy-shield-extension.zip` file
   - Extract the ZIP file to a folder on your computer

2. **Enable Developer Mode in Chrome**
   - Open Google Chrome
   - Navigate to `chrome://extensions/`
   - Toggle "Developer mode" ON (top-right corner)

3. **Load the Extension**
   - Click "Load unpacked" button
   - Select the extracted `chrome-extension-project` folder
   - The Privacy Shield icon 🛡️ should appear in your toolbar

4. **Test the Extension**
   - Open the included `test-page.html` file in Chrome
   - Click the Privacy Shield extension icon
   - Click "Capture Screenshot" to test functionality

## 🎯 What It Does

### Automatic Detection & Redaction
Privacy Shield automatically detects and redacts these types of sensitive information:

- ✉️ **Email Addresses** (john.doe@example.com)
- 📞 **Phone Numbers** ((555) 123-4567)
- 💳 **Credit Card Numbers** (4532 1234 5678 9012)
- 🆔 **Social Security Numbers** (123-45-6789)
- 🏦 **Bank Account Numbers** (1234567890123456)
- 🏠 **Street Addresses** (123 Main Street, Anytown, CA)
- 📮 **ZIP Codes** (90210)
- 🌐 **IP Addresses** (192.168.1.1)
- 📘 **Passport Numbers** (AB1234567)
- 🚗 **Driver License Numbers** (D1234567)

### Apple-Like Interface
- Clean, minimalist design following Apple's guidelines
- Smooth animations and transitions
- Professional blue color scheme
- Dark mode support
- Responsive layout

### Privacy Features
- **100% Local Processing** - No data leaves your device
- **Automatic Redaction** - Black boxes cover sensitive areas
- **Download Capability** - Save redacted screenshots
- **Detection Summary** - See what was found and redacted
- **Confidence Indicators** - Know how certain the detection is

## 🔧 How to Use

1. **Navigate to any webpage** with potentially sensitive information
2. **Click the Privacy Shield icon** in your Chrome toolbar
3. **Click "Capture Screenshot"** to take a screenshot
4. **Review the results**:
   - See detected sensitive information
   - View the redacted screenshot
   - Check detection statistics
5. **Download** the redacted screenshot if needed

## 📊 Expected Results

When testing with the included test page, you should see:
- **~21 total detections** across various data types
- **Black boxes** covering all sensitive information
- **Detection summary** showing counts by category
- **Confidence indicators** for each detection

## 🔒 Privacy & Security

- **No Network Access**: All processing happens locally
- **No Data Storage**: Information is not permanently stored
- **No Tracking**: Extension doesn't collect user data
- **Secure Processing**: Uses browser's built-in security features

## 🛠️ Technical Details

### Browser Requirements
- Chrome 88+ (Manifest V3 support)
- Chromium-based browsers (Edge, Brave, etc.)

### Permissions Used
- `activeTab`: Screenshot capture of current tab
- `storage`: Temporary session data only
- `downloads`: Save redacted screenshots
- `scripting`: Inject content scripts for page analysis

### File Structure
```
chrome-extension-project/
├── manifest.json          # Extension configuration
├── popup.html             # Main interface
├── background.js          # Service worker
├── content.js             # Page interaction
├── test-page.html         # Test page with sample data
├── css/                   # Apple-themed styles
├── js/                    # Core functionality
├── icons/                 # Extension icons
└── README.md              # Documentation
```

## 🚀 Advanced Features

### Detection Algorithms
- **Pattern Matching**: Advanced regex patterns
- **Validation**: Luhn algorithm for credit cards, format validation for SSNs
- **Confidence Scoring**: Reduces false positives
- **Context Analysis**: Considers surrounding text

### Image Processing
- **Canvas-based**: High-quality image manipulation
- **Rounded Corners**: Professional-looking redaction boxes
- **Preview Mode**: See highlights before redaction
- **Export Quality**: High-resolution PNG output

## 🔧 Troubleshooting

### Extension Not Loading
- Ensure Developer mode is enabled
- Check that you selected the correct folder
- Refresh the extensions page

### Screenshot Not Working
- Ensure the extension has permission for the current tab
- Try refreshing the page and extension
- Check browser console for errors

### No Detections Found
- The page may not contain detectable sensitive information
- Try the included test page to verify functionality
- Some patterns may require specific formatting

## 📞 Support

If you encounter issues:
1. Try the test page first to verify basic functionality
2. Check the browser console for error messages
3. Ensure you're using a supported browser version
4. Verify all files were extracted properly

## 🎨 Design Credits

Interface design follows Apple's Human Interface Guidelines:
- Typography: SF Pro Display font family
- Colors: Apple's signature blue (#007AFF)
- Layout: 8px grid system
- Animations: Smooth, purposeful transitions
- Accessibility: Proper contrast ratios and touch targets

---

**Privacy Shield** - Protecting your sensitive information, one screenshot at a time. 🛡️

