# 🚀 Quick Start Guide

Quick reference for common development tasks.

## 📁 Project Structure at a Glance

```
src/
├── components/
│   ├── common/          # Reusable components like buttons, modals
│   ├── layout/          # Header, Footer, Navigation
│   └── features/        # Feature-specific components (e.g., wins/)
├── hooks/               # Custom hooks (useWins, useTheme, etc.)
├── utils/               # Helper functions
├── constants/           # App constants
└── App.jsx             # Main app component
```

## ⚡ Quick Commands

### Adding a New Component

**1. Common/Reusable Component:**
```bash
# Create file
touch src/components/common/Button.jsx

# Add export to index.js
echo "export { default as Button } from './Button';" >> src/components/common/index.js
```

**2. Feature Component:**
```bash
# Create feature folder and files
mkdir -p src/components/features/your-feature
touch src/components/features/your-feature/YourComponent.jsx
touch src/components/features/your-feature/index.js
```

### Adding a Custom Hook

```bash
# Create hook file
touch src/hooks/useYourHook.js

# Add export to index.js
echo "export { useYourHook } from './useYourHook';" >> src/hooks/index.js
```

### Adding Utility Functions

```bash
# Create or edit utils file
touch src/utils/yourUtils.js

# Add export to index.js
echo "export * from './yourUtils';" >> src/utils/index.js
```

## 📝 Code Templates

### Component Template
```jsx
import { Box } from '@mui/material';

const MyComponent = ({ prop1, prop2 }) => {
  return (
    <Box>
      {/* Your component */}
    </Box>
  );
};

export default MyComponent;
```

### Custom Hook Template
```javascript
import { useState, useEffect } from 'react';

export const useMyHook = () => {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Your logic
  }, []);

  return { state, setState };
};
```

### Utility Function Template
```javascript
/**
 * Description
 * @param {type} param - Description
 * @returns {type} - Description
 */
export const myFunction = (param) => {
  // Your logic
  return result;
};
```

## 🎯 Common Patterns

### Import Pattern
```jsx
// 1. React & external libraries
import { useState } from 'react';
import { Box } from '@mui/material';

// 2. Hooks, utils, constants
import { useWins } from './hooks';
import { formatDate } from './utils';

// 3. Components
import { Header } from './components/layout';

// 4. Styles
import './styles.css';
```

### Component with Custom Hook
```jsx
import { useWins } from '../../hooks';

const WinsComponent = () => {
  const { wins, addWin, removeWin } = useWins();
  
  return (
    <div>
      {wins.map(win => (
        <div key={win.id}>{win.text}</div>
      ))}
    </div>
  );
};
```

## 🔍 Where to Put Things

| What                    | Where                                    |
|-------------------------|------------------------------------------|
| Reusable UI components  | `src/components/common/`                |
| Layout (Header, Nav)    | `src/components/layout/`                |
| Feature components      | `src/components/features/feature-name/` |
| Custom hooks            | `src/hooks/`                            |
| Utility functions       | `src/utils/`                            |
| Constants/Config        | `src/constants/`                        |
| Global styles           | `src/index.css` or `src/styles/`        |
| Component styles        | Component's CSS file                    |

## 💡 Tips

1. **Always use index.js** for clean imports
2. **One component per file**
3. **Extract logic to custom hooks** when reused
4. **Keep components small** (<200 lines)
5. **Use constants** instead of magic strings/numbers

## 📦 Current Features

- **Wins Management** (`src/components/features/wins/`)
  - WinsList
  - WinContextMenu
  - CalendarModal
  - InstallButton

- **Custom Hooks** (`src/hooks/`)
  - useWins - Wins state management
  - useTheme - Dark/light mode
  - useLocalStorage - localStorage with state
  - useInstallPrompt - PWA install
  - useKeyboardHeight - Mobile keyboard detection

## 🛠️ Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📖 Need More Details?

See `PROJECT_STRUCTURE.md` for comprehensive documentation.

---

**Remember:** Follow the existing patterns for consistency! 🎨

