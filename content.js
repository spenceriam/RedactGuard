// Content Script
// Runs in the context of web pages to assist with screenshot analysis

console.log('Privacy Shield content script loaded');

// Listen for messages from popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageInfo') {
    // Get page information that might be useful for detection
    const pageInfo = {
      url: window.location.href,
      title: document.title,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      scroll: {
        x: window.scrollX,
        y: window.scrollY
      }
    };
    
    sendResponse({ success: true, pageInfo });
  }
  
  if (request.action === 'highlightElements') {
    // Highlight detected sensitive elements on the page
    highlightSensitiveAreas(request.areas);
    sendResponse({ success: true });
  }
  
  return true;
});

// Function to highlight sensitive areas on the page
function highlightSensitiveAreas(areas) {
  // Remove existing highlights
  const existingHighlights = document.querySelectorAll('.privacy-shield-highlight');
  existingHighlights.forEach(el => el.remove());
  
  // Add new highlights
  areas.forEach((area, index) => {
    const highlight = document.createElement('div');
    highlight.className = 'privacy-shield-highlight';
    highlight.style.cssText = `
      position: fixed;
      top: ${area.y}px;
      left: ${area.x}px;
      width: ${area.width}px;
      height: ${area.height}px;
      background-color: rgba(255, 0, 0, 0.3);
      border: 2px solid #ff0000;
      border-radius: 4px;
      z-index: 10000;
      pointer-events: none;
      animation: privacy-shield-pulse 2s infinite;
    `;
    
    document.body.appendChild(highlight);
    
    // Remove highlight after 5 seconds
    setTimeout(() => {
      if (highlight.parentNode) {
        highlight.remove();
      }
    }, 5000);
  });
}

// Add CSS animation for highlights
const style = document.createElement('style');
style.textContent = `
  @keyframes privacy-shield-pulse {
    0% { opacity: 0.7; }
    50% { opacity: 0.3; }
    100% { opacity: 0.7; }
  }
`;
document.head.appendChild(style);

// Function to extract text content from the page for analysis
function extractPageText() {
  const textNodes = [];
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        // Skip script and style elements
        const parent = node.parentElement;
        if (parent && (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE')) {
          return NodeFilter.FILTER_REJECT;
        }
        
        // Only include visible text
        const text = node.textContent.trim();
        if (text.length > 0) {
          return NodeFilter.FILTER_ACCEPT;
        }
        
        return NodeFilter.FILTER_REJECT;
      }
    }
  );
  
  let node;
  while (node = walker.nextNode()) {
    const rect = node.parentElement.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      textNodes.push({
        text: node.textContent.trim(),
        element: node.parentElement,
        rect: {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height
        }
      });
    }
  }
  
  return textNodes;
}

