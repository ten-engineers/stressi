# 📊 Visual Project Structure

## 🗂️ Complete File Tree

```
stressi/
│
├── 📄 Configuration Files
│   ├── package.json              # Dependencies and scripts
│   ├── vite.config.js            # Vite configuration
│   ├── eslint.config.js          # ESLint rules
│   └── .cursorrules              # Project coding standards
│
├── 📚 Documentation
│   ├── README.md                 # Main project readme
│   ├── QUICK_START.md            # Quick reference guide
│   ├── PROJECT_STRUCTURE.md      # Detailed structure guide
│   ├── ARCHITECTURE.md           # Architecture decisions
│   └── STRUCTURE_DIAGRAM.md      # This file
│
├── 📁 public/                    # Static assets
│   ├── icon-192x192.png
│   ├── icon-512x512.png
│   └── ...
│
└── 📁 src/                       # Source code
    │
    ├── 🎨 Styles
    │   ├── index.css             # Global styles
    │   └── App.css               # App-specific styles
    │
    ├── 🔧 Core Files
    │   ├── main.jsx              # Application entry point
    │   └── App.jsx               # Main app component (orchestrates everything)
    │
    ├── 🎯 Components
    │   ├── common/               # Reusable UI components
    │   │   ├── ThemeSwitcher.jsx
    │   │   └── index.js          # Export file
    │   │
    │   ├── layout/               # Layout structure components
    │   │   ├── Header.jsx        # App header with title
    │   │   ├── InputBar.jsx      # Bottom input bar
    │   │   └── index.js
    │   │
    │   └── features/             # Feature-specific components
    │       └── wins/             # Wins tracking feature
    │           ├── WinsList.jsx        # Display grouped wins
    │           ├── WinContextMenu.jsx  # Context menu for actions
    │           ├── CalendarModal.jsx   # Calendar view
    │           ├── InstallButton.jsx   # PWA install button
    │           └── index.js
    │
    ├── 🪝 Hooks
    │   ├── useLocalStorage.js    # Generic localStorage hook
    │   ├── useTheme.js           # Theme management
    │   ├── useWins.js            # Wins state management
    │   ├── useInstallPrompt.js   # PWA install handling
    │   ├── useKeyboardHeight.js  # Mobile keyboard detection
    │   └── index.js              # Central export
    │
    ├── 🔨 Utils
    │   ├── dateUtils.js          # Date formatting functions
    │   └── index.js
    │
    └── 📋 Constants
        ├── app.js                # App-wide constants
        └── index.js
```

## 🔄 Component Hierarchy

```
App.jsx (Main Container)
│
├── ThemeProvider (MUI)
│   │
│   ├── CssBaseline
│   │
│   ├── Header
│   │   └── ThemeSwitcher
│   │
│   ├── Box (Spacer)
│   │
│   ├── InstallButton
│   │
│   ├── InputBar
│   │   ├── TextField
│   │   └── Button (Send Icon)
│   │
│   ├── WinsList
│   │   └── List
│   │       └── Paper (for each date)
│   │           ├── ListItem (for each win)
│   │           └── ListSubheader (date)
│   │
│   ├── CalendarModal
│   │   └── Dialog
│   │       ├── AppBar
│   │       └── MonthGrid (for each month)
│   │           └── Grid (calendar days)
│   │
│   └── WinContextMenu
│       └── Menu
│           ├── MenuItem (Copy)
│           └── MenuItem (Delete)
```

## 📦 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                        App.jsx                          │
│                  (Orchestration Layer)                  │
└───────────┬─────────────────────────────────┬───────────┘
            │                                 │
            ▼                                 ▼
    ┌───────────────┐                 ┌──────────────┐
    │  Custom Hooks │                 │  Components  │
    └───────┬───────┘                 └──────┬───────┘
            │                                │
    ┌───────┴────────┐                      │
    │                │                      │
    ▼                ▼                      ▼
┌─────────┐    ┌──────────┐         ┌──────────────┐
│useWins  │    │useTheme  │         │  UI Renders  │
│useInstall    │useKeyboard         │              │
└────┬────┘    └──────────┘         └──────────────┘
     │
     ▼
┌──────────────┐
│ localStorage │
│   - wins     │
│   - theme    │
└──────────────┘
```

## 🎭 State Management Map

```
App.jsx (Local State)
├── contextMenu          → WinContextMenu position
├── selectedWin          → Currently selected win
├── isCalendarOpen       → Calendar modal state
└── currentDate          → Calendar current date

useWins Hook (Feature State)
├── wins                 → Array of all wins
├── text                 → Current input text
├── error                → Input validation error
├── groupedWins          → Wins grouped by date
└── localStorage sync    → Persists wins data

useTheme Hook (Theme State)
├── darkMode             → Current theme mode
├── theme                → MUI theme object
└── localStorage sync    → Persists theme preference

useInstallPrompt Hook (PWA State)
├── isInstallable        → Can show install button
└── deferredPrompt       → PWA install prompt event

useKeyboardHeight Hook (UI State)
└── keyboardHeight       → Mobile keyboard height
```

## 🚀 Common User Flows

### Adding a Win
```
User types in InputBar
    ↓
onChange updates text (useWins)
    ↓
User presses Enter or Send
    ↓
addWin() creates new win object
    ↓
Updates wins array
    ↓
Saves to localStorage
    ↓
WinsList re-renders with new win
    ↓
InputBar clears
```

### Deleting a Win
```
User taps/right-clicks on win
    ↓
handleContextMenu sets selectedWin
    ↓
WinContextMenu opens
    ↓
User clicks Delete
    ↓
removeWin(id) called
    ↓
Filters wins array
    ↓
Updates localStorage
    ↓
WinsList re-renders
    ↓
Menu closes
```

### Viewing Calendar
```
User clicks date in WinsList
    ↓
setIsCalendarOpen(true)
    ↓
CalendarModal opens
    ↓
Scrolls to bottom (current month)
    ↓
Shows wins marked on dates
    ↓
User clicks date with wins
    ↓
Closes modal
    ↓
Scrolls to that date in WinsList
```

## 📁 Quick Reference: Where to Add What

| I want to add...            | Put it in...                              |
|----------------------------|-------------------------------------------|
| A reusable button          | `src/components/common/Button.jsx`       |
| A new page layout          | `src/components/layout/PageLayout.jsx`   |
| Settings feature           | `src/components/features/settings/`      |
| Statistics feature         | `src/components/features/statistics/`    |
| Data fetching hook         | `src/hooks/useFetch.js`                  |
| Date formatting            | `src/utils/dateUtils.js`                 |
| API endpoints              | `src/constants/api.js`                   |
| Global theme config        | `src/styles/theme.js`                    |
| Context provider           | `src/contexts/YourContext.jsx`           |

## 🎯 Import Paths Examples

```javascript
// From App.jsx
import { useWins, useTheme } from './hooks';
import { Header, InputBar } from './components/layout';
import { WinsList } from './components/features/wins';
import { APP_NAME } from './constants';

// From a component in features/wins/
import { useWins } from '../../../hooks';
import { formatDateShort } from '../../../utils';
import { ThemeSwitcher } from '../../common';

// From a hook
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../constants';
```

## 💡 Tips for Navigation

1. **Start at App.jsx** - See the big picture
2. **Follow imports** - Understand dependencies
3. **Check index.js files** - See what's exported
4. **Read hooks first** - Understand the logic
5. **Then look at components** - See how they use hooks

---

Use this diagram when:
- 🗺️ Getting oriented in the project
- 📝 Planning where to add new code
- 🔍 Debugging to find which file handles what
- 📚 Onboarding new developers


