# 📁 Project Structure Guide

This guide explains the project structure and how to extend the Stressi application.

## 🏗️ Directory Structure

```
src/
├── components/           # React components organized by type
│   ├── common/          # Reusable UI components (buttons, inputs, etc.)
│   ├── layout/          # Layout components (header, footer, sidebars)
│   └── features/        # Feature-specific components
│       └── wins/        # Wins feature components
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── constants/           # App-wide constants and configurations
├── contexts/            # React Context providers (if needed)
├── styles/              # Global styles and theme configurations
├── App.jsx              # Main application component
├── main.jsx             # Application entry point
└── index.css            # Global CSS
```

## 📦 Component Organization

### Common Components (`src/components/common/`)
Reusable UI components used across the application.

**Example:** ThemeSwitcher, Button, Modal, etc.

### Layout Components (`src/components/layout/`)
Components that define the application layout structure.

**Current components:**
- `Header.jsx` - Application header with title and theme switcher
- `InputBar.jsx` - Fixed bottom input bar for adding wins

### Feature Components (`src/components/features/`)
Feature-specific components organized by feature domain.

**Current features:**
- `wins/` - All components related to wins management
  - `WinsList.jsx` - Displays grouped wins
  - `WinContextMenu.jsx` - Context menu for win actions
  - `CalendarModal.jsx` - Calendar view of wins
  - `InstallButton.jsx` - PWA install button

## 🪝 Custom Hooks (`src/hooks/`)

Custom hooks encapsulate reusable logic:

- `useLocalStorage.js` - Manage localStorage with React state
- `useTheme.js` - Theme management (dark/light mode)
- `useWins.js` - Wins state management
- `useInstallPrompt.js` - PWA install prompt handling
- `useKeyboardHeight.js` - Mobile keyboard height detection

## 🛠️ How to Extend

### Adding a New Component

#### 1. Common Component (Reusable)

```bash
# Create file
touch src/components/common/YourComponent.jsx
```

```jsx
// src/components/common/YourComponent.jsx
import { Box } from '@mui/material';

const YourComponent = ({ prop1, prop2 }) => {
  return (
    <Box>
      {/* Your component logic */}
    </Box>
  );
};

export default YourComponent;
```

```javascript
// Update src/components/common/index.js
export { default as YourComponent } from './YourComponent';
```

**Usage:**
```jsx
import { YourComponent } from './components/common';
```

#### 2. Feature Component

```bash
# Create new feature directory
mkdir -p src/components/features/your-feature

# Create component file
touch src/components/features/your-feature/YourFeature.jsx
touch src/components/features/your-feature/index.js
```

```jsx
// src/components/features/your-feature/YourFeature.jsx
const YourFeature = () => {
  return <div>Your Feature</div>;
};

export default YourFeature;
```

```javascript
// src/components/features/your-feature/index.js
export { default as YourFeature } from './YourFeature';
```

**Usage:**
```jsx
import { YourFeature } from './components/features/your-feature';
```

### Adding a New Page (with React Router)

If you want to add routing:

1. **Install React Router:**
```bash
npm install react-router-dom
```

2. **Create pages directory:**
```bash
mkdir src/pages
```

3. **Create a page component:**
```jsx
// src/pages/SettingsPage.jsx
const SettingsPage = () => {
  return (
    <Box>
      <h1>Settings</h1>
      {/* Your settings content */}
    </Box>
  );
};

export default SettingsPage;
```

4. **Update App.jsx:**
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}
```

### Adding a Custom Hook

```bash
touch src/hooks/useYourHook.js
```

```javascript
// src/hooks/useYourHook.js
import { useState, useEffect } from 'react';

/**
 * Description of what your hook does
 * @returns {object} - Returns whatever your hook exposes
 */
export const useYourHook = () => {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Your logic
  }, []);

  return { state, setState };
};
```

```javascript
// Update src/hooks/index.js
export { useYourHook } from './useYourHook';
```

**Usage:**
```jsx
import { useYourHook } from './hooks';

function MyComponent() {
  const { state, setState } = useYourHook();
  // ...
}
```

### Adding Utility Functions

```bash
touch src/utils/yourUtils.js
```

```javascript
// src/utils/yourUtils.js
/**
 * Description of what this function does
 * @param {type} param - Parameter description
 * @returns {type} - Return value description
 */
export const yourUtilFunction = (param) => {
  // Your logic
  return result;
};
```

```javascript
// Update src/utils/index.js
export * from './yourUtils';
```

**Usage:**
```jsx
import { yourUtilFunction } from './utils';
```

### Adding Constants

```bash
# Edit existing or create new constants file
touch src/constants/yourConstants.js
```

```javascript
// src/constants/yourConstants.js
export const YOUR_CONSTANT = 'value';

export const YOUR_CONFIG = {
  key1: 'value1',
  key2: 'value2',
};
```

```javascript
// Update src/constants/index.js
export * from './yourConstants';
```

**Usage:**
```jsx
import { YOUR_CONSTANT } from './constants';
```

### Adding a Context (State Management)

For global state that needs to be accessed by many components:

```bash
touch src/contexts/YourContext.jsx
```

```jsx
// src/contexts/YourContext.jsx
import { createContext, useContext, useState } from 'react';

const YourContext = createContext();

export const YourProvider = ({ children }) => {
  const [state, setState] = useState(null);

  const value = {
    state,
    setState,
    // Other state and functions
  };

  return (
    <YourContext.Provider value={value}>
      {children}
    </YourContext.Provider>
  );
};

export const useYourContext = () => {
  const context = useContext(YourContext);
  if (!context) {
    throw new Error('useYourContext must be used within YourProvider');
  }
  return context;
};
```

**Usage in App.jsx:**
```jsx
import { YourProvider } from './contexts/YourContext';

function App() {
  return (
    <YourProvider>
      <ThemeProvider theme={theme}>
        {/* rest of app */}
      </ThemeProvider>
    </YourProvider>
  );
}
```

**Usage in components:**
```jsx
import { useYourContext } from './contexts/YourContext';

function MyComponent() {
  const { state, setState } = useYourContext();
  // ...
}
```

## 📝 Best Practices

### 1. Component Design
- Keep components small and focused on a single responsibility
- Use props for configuration, not hard-coded values
- Extract reusable logic into custom hooks
- Use TypeScript for better type safety (optional)

### 2. File Naming
- Components: PascalCase (e.g., `MyComponent.jsx`)
- Hooks: camelCase with 'use' prefix (e.g., `useMyHook.js`)
- Utils: camelCase (e.g., `myUtils.js`)
- Constants: camelCase for files, UPPER_CASE for values

### 3. Import Organization
```jsx
// 1. External libraries
import { useState } from 'react';
import { Box } from '@mui/material';

// 2. Internal modules (hooks, utils, constants)
import { useWins } from './hooks';
import { formatDate } from './utils';
import { APP_NAME } from './constants';

// 3. Components
import { Header } from './components/layout';
import { WinsList } from './components/features/wins';

// 4. Styles
import './App.css';
```

### 4. Prop Drilling vs Context
- For 2-3 levels of components: use props
- For deeply nested or many components: use Context or state management library

### 5. Performance Optimization
- Use `useMemo` for expensive calculations
- Use `useCallback` for functions passed as props
- Use `React.memo` for components that render often with same props

## 🚀 Example: Adding a Statistics Feature

Let's add a statistics page showing wins analytics:

```bash
# 1. Create feature directory
mkdir -p src/components/features/statistics

# 2. Create hook for statistics logic
touch src/hooks/useStatistics.js

# 3. Create components
touch src/components/features/statistics/StatisticsCard.jsx
touch src/components/features/statistics/StatisticsChart.jsx
touch src/components/features/statistics/index.js
```

```javascript
// src/hooks/useStatistics.js
import { useMemo } from 'react';

export const useStatistics = (wins) => {
  const stats = useMemo(() => {
    const total = wins.length;
    const thisWeek = wins.filter(win => {
      const date = new Date(win.date);
      const now = new Date();
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      return date >= weekAgo;
    }).length;
    
    return { total, thisWeek };
  }, [wins]);

  return stats;
};

// Add to src/hooks/index.js
export { useStatistics } from './useStatistics';
```

```jsx
// src/components/features/statistics/StatisticsCard.jsx
import { Card, CardContent, Typography } from '@mui/material';

const StatisticsCard = ({ title, value }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h3">{value}</Typography>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
```

```jsx
// src/components/features/statistics/index.js
export { default as StatisticsCard } from './StatisticsCard';
```

```jsx
// Usage in App.jsx
import { useStatistics } from './hooks';
import { StatisticsCard } from './components/features/statistics';

function App() {
  const { wins } = useWins();
  const { total, thisWeek } = useStatistics(wins);

  return (
    <Box>
      <StatisticsCard title="Total Wins" value={total} />
      <StatisticsCard title="This Week" value={thisWeek} />
      {/* rest of app */}
    </Box>
  );
}
```

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [React Router Documentation](https://reactrouter.com/)
- [React Hooks Guide](https://react.dev/reference/react)

## 🤝 Contributing

When adding new features:
1. Follow the existing file structure
2. Keep components focused and reusable
3. Add JSDoc comments for functions and hooks
4. Test your changes before committing
5. Update this guide if you add new patterns

---

Happy coding! 🎉

