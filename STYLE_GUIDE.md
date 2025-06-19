# Apple-Like UI Design Guide for Chrome Extension

## Design Philosophy
Based on Apple's Human Interface Guidelines, our Chrome extension will embody Apple's core design principles:

### Key Principles
- **Clarity**: Clean, readable interface with purposeful use of space
- **Deference**: Content takes priority over interface elements
- **Depth**: Visual layers and realistic motion provide hierarchy and vitality

## Visual Design System

### Color Palette
- **Primary Blue**: #007AFF (Apple's signature blue)
- **Success Green**: #34C759
- **Warning Orange**: #FF9500
- **Destructive Red**: #FF3B30
- **Background Colors**:
  - Light mode: #FFFFFF (primary), #F2F2F7 (secondary)
  - Dark mode: #000000 (primary), #1C1C1E (secondary)
- **Text Colors**:
  - Primary: #000000 (light), #FFFFFF (dark)
  - Secondary: #3C3C43 (light), #EBEBF5 (dark)

### Typography
- **Primary Font**: SF Pro Display (fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto)
- **Font Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)
- **Font Sizes**:
  - Large Title: 34px
  - Title 1: 28px
  - Title 2: 22px
  - Title 3: 20px
  - Headline: 17px (semibold)
  - Body: 17px
  - Callout: 16px
  - Subhead: 15px
  - Footnote: 13px
  - Caption: 12px

### Layout & Spacing
- **Base Unit**: 8px grid system
- **Margins**: 16px (standard), 20px (large)
- **Padding**: 8px, 12px, 16px, 20px
- **Border Radius**: 8px (small), 12px (medium), 16px (large)

### Components

#### Buttons
- **Primary Button**: Blue background (#007AFF), white text, 8px border radius
- **Secondary Button**: Gray background (#F2F2F7), dark text, 8px border radius
- **Destructive Button**: Red background (#FF3B30), white text, 8px border radius
- **Height**: 44px minimum for touch targets
- **Padding**: 16px horizontal, 12px vertical

#### Cards
- **Background**: White (#FFFFFF) with subtle shadow
- **Border Radius**: 12px
- **Shadow**: 0 2px 10px rgba(0,0,0,0.1)
- **Padding**: 16px

#### Status Indicators
- **Success**: Green circle with checkmark
- **Warning**: Orange circle with exclamation
- **Error**: Red circle with X
- **Info**: Blue circle with i

## Extension-Specific UI Elements

### Main Interface
- **Header**: Extension title with Apple-style large title typography
- **Screenshot Preview**: Rounded corner card with subtle shadow
- **Detection Summary**: Clean card layout with status indicators
- **Action Buttons**: Apple-style button hierarchy

### Detection Results Display
- **Data Point Cards**: Individual cards for each detected sensitive item
- **Redaction Indicators**: Visual representation of black boxes applied
- **Statistics**: Clean numerical display with appropriate icons

### Interaction Patterns
- **Hover States**: Subtle opacity changes (0.8)
- **Active States**: Slight scale transform (0.95)
- **Transitions**: Smooth 0.2s ease-in-out animations
- **Loading States**: Apple-style activity indicators

## Implementation Notes
- Use CSS custom properties for consistent theming
- Implement proper focus states for accessibility
- Support both light and dark mode preferences
- Ensure minimum 44px touch targets for all interactive elements
- Use semantic HTML for screen reader compatibility

