# 🔧 Extending Your Project - Step by Step

This guide provides copy-paste commands and code for common extension tasks.

## 📝 Table of Contents

1. [Add a New Reusable Component](#1-add-a-new-reusable-component)
2. [Add a New Feature](#2-add-a-new-feature)
3. [Add a Custom Hook](#3-add-a-custom-hook)
4. [Add Utility Functions](#4-add-utility-functions)
5. [Add Constants](#5-add-constants)
6. [Add Routing (Multi-page)](#6-add-routing-multi-page)
7. [Add Global State (Context)](#7-add-global-state-context)
8. [Add API Integration](#8-add-api-integration)

---

## 1. Add a New Reusable Component

### Example: Adding a Button Component

**Step 1:** Create the component file
```bash
touch src/components/common/Button.jsx
```

**Step 2:** Write the component
```jsx
// src/components/common/Button.jsx
import { Button as MuiButton } from '@mui/material';

const Button = ({ 
  children, 
  variant = 'contained', 
  color = 'primary',
  onClick,
  ...props 
}) => {
  return (
    <MuiButton 
      variant={variant} 
      color={color} 
      onClick={onClick}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
```

**Step 3:** Export it
```bash
# Add to src/components/common/index.js
echo "export { default as Button } from './Button';" >> src/components/common/index.js
```

**Step 4:** Use it
```jsx
import { Button } from './components/common';

<Button onClick={handleClick}>Click Me</Button>
```

---

## 2. Add a New Feature

### Example: Adding a Statistics Feature

**Step 1:** Create feature directory
```bash
mkdir -p src/components/features/statistics
touch src/components/features/statistics/StatisticsCard.jsx
touch src/components/features/statistics/StatisticsPanel.jsx
touch src/components/features/statistics/index.js
```

**Step 2:** Create the hook for logic
```bash
touch src/hooks/useStatistics.js
```

```javascript
// src/hooks/useStatistics.js
import { useMemo } from 'react';

export const useStatistics = (wins) => {
  const stats = useMemo(() => {
    const total = wins.length;
    
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisWeek = wins.filter(win => 
      new Date(win.date) >= weekAgo
    ).length;
    
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const thisMonth = wins.filter(win => 
      new Date(win.date) >= monthAgo
    ).length;
    
    return { total, thisWeek, thisMonth };
  }, [wins]);

  return stats;
};
```

```javascript
// Add to src/hooks/index.js
export { useStatistics } from './useStatistics';
```

**Step 3:** Create the component
```jsx
// src/components/features/statistics/StatisticsCard.jsx
import { Card, CardContent, Typography, Box } from '@mui/material';

const StatisticsCard = ({ title, value, subtitle }) => {
  return (
    <Card sx={{ minWidth: 150 }}>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h3" component="div">
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
```

```jsx
// src/components/features/statistics/StatisticsPanel.jsx
import { Box, Typography } from '@mui/material';
import StatisticsCard from './StatisticsCard';

const StatisticsPanel = ({ stats }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Your Statistics
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <StatisticsCard 
          title="Total Wins" 
          value={stats.total}
          subtitle="All time"
        />
        <StatisticsCard 
          title="This Week" 
          value={stats.thisWeek}
          subtitle="Last 7 days"
        />
        <StatisticsCard 
          title="This Month" 
          value={stats.thisMonth}
          subtitle="Last 30 days"
        />
      </Box>
    </Box>
  );
};

export default StatisticsPanel;
```

```javascript
// src/components/features/statistics/index.js
export { default as StatisticsCard } from './StatisticsCard';
export { default as StatisticsPanel } from './StatisticsPanel';
```

**Step 4:** Use in App.jsx
```jsx
// Add imports
import { useStatistics } from './hooks';
import { StatisticsPanel } from './components/features/statistics';

// Inside App component
const { wins } = useWins();
const stats = useStatistics(wins);

// In JSX (add after Header)
<StatisticsPanel stats={stats} />
```

---

## 3. Add a Custom Hook

### Example: Adding a useFetch Hook

```bash
touch src/hooks/useFetch.js
```

```javascript
// src/hooks/useFetch.js
import { useState, useEffect } from 'react';

/**
 * Custom hook for fetching data from an API
 * @param {string} url - The URL to fetch from
 * @returns {object} - { data, loading, error }
 */
export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchData();
    }
  }, [url]);

  return { data, loading, error };
};
```

```javascript
// Add to src/hooks/index.js
export { useFetch } from './useFetch';
```

**Usage:**
```jsx
import { useFetch } from './hooks';

const MyComponent = () => {
  const { data, loading, error } = useFetch('https://api.example.com/data');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{JSON.stringify(data)}</div>;
};
```

---

## 4. Add Utility Functions

### Example: Adding String Utilities

```bash
touch src/utils/stringUtils.js
```

```javascript
// src/utils/stringUtils.js

/**
 * Truncate a string to a specified length
 * @param {string} str - The string to truncate
 * @param {number} length - Maximum length
 * @returns {string} - Truncated string
 */
export const truncate = (str, length = 50) => {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
};

/**
 * Capitalize first letter of each word
 * @param {string} str - The string to capitalize
 * @returns {string} - Capitalized string
 */
export const capitalize = (str) => {
  return str.replace(/\b\w/g, char => char.toUpperCase());
};

/**
 * Convert string to slug format
 * @param {string} str - The string to slugify
 * @returns {string} - Slug string
 */
export const slugify = (str) => {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};
```

```javascript
// Add to src/utils/index.js
export * from './stringUtils';
```

**Usage:**
```jsx
import { truncate, capitalize, slugify } from './utils';

const text = truncate('This is a very long text...', 20);
const title = capitalize('hello world');
const slug = slugify('My Blog Post Title');
```

---

## 5. Add Constants

### Example: Adding API Constants

```bash
touch src/constants/api.js
```

```javascript
// src/constants/api.js

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';

export const API_ENDPOINTS = {
  WINS: '/wins',
  USERS: '/users',
  STATS: '/statistics',
};

export const API_TIMEOUT = 10000; // 10 seconds

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};
```

```javascript
// Add to src/constants/index.js
export * from './api';
```

**Usage:**
```jsx
import { API_BASE_URL, API_ENDPOINTS } from './constants';

const url = `${API_BASE_URL}${API_ENDPOINTS.WINS}`;
```

---

## 6. Add Routing (Multi-page)

### Step 1: Install React Router
```bash
npm install react-router-dom
```

### Step 2: Create pages directory and pages
```bash
mkdir src/pages
touch src/pages/HomePage.jsx
touch src/pages/SettingsPage.jsx
touch src/pages/StatisticsPage.jsx
```

```jsx
// src/pages/HomePage.jsx
import { Box } from '@mui/material';
import { WinsList, InstallButton, InputBar } from '../components/features/wins';
import { useWins, useInstallPrompt, useKeyboardHeight } from '../hooks';

const HomePage = ({ darkMode }) => {
  const { 
    wins, text, error, addWin, removeWin, 
    handleChange, handleKeyDown, groupedWins 
  } = useWins();
  const { isInstallable, handleInstallClick } = useInstallPrompt();
  const keyboardHeight = useKeyboardHeight();

  return (
    <Box>
      <InstallButton isInstallable={isInstallable} onInstall={handleInstallClick} />
      
      <InputBar
        text={text}
        error={error}
        darkMode={darkMode}
        keyboardHeight={keyboardHeight}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onSubmit={addWin}
      />
      
      <WinsList
        groupedWins={groupedWins}
        darkMode={darkMode}
        onContextMenu={() => {}}
        setCurrentDate={() => {}}
        setIsCalendarOpen={() => {}}
      />
    </Box>
  );
};

export default HomePage;
```

```jsx
// src/pages/SettingsPage.jsx
import { Box, Typography, Switch, FormControlLabel } from '@mui/material';

const SettingsPage = ({ darkMode, setDarkMode }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Settings</Typography>
      
      <FormControlLabel
        control={
          <Switch 
            checked={darkMode} 
            onChange={(e) => setDarkMode(e.target.checked)} 
          />
        }
        label="Dark Mode"
      />
    </Box>
  );
};

export default SettingsPage;
```

### Step 3: Update App.jsx with routing
```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { useTheme } from './hooks';
import { Header } from './components/layout';
import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

function App() {
  const { darkMode, setDarkMode, theme } = useTheme();

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <Box sx={{ paddingTop: '64px' }} />
        
        <Routes>
          <Route path="/" element={<HomePage darkMode={darkMode} />} />
          <Route path="/settings" element={<SettingsPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
```

---

## 7. Add Global State (Context)

### Example: Adding Auth Context

```bash
touch src/contexts/AuthContext.jsx
```

```jsx
// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Your login logic here
    const userData = { email, name: 'User' };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

**Usage in App.jsx:**
```jsx
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        {/* rest of app */}
      </ThemeProvider>
    </AuthProvider>
  );
}
```

**Usage in components:**
```jsx
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <button onClick={() => login('email', 'pass')}>Login</button>;
  }
  
  return <div>Welcome {user.name}!</div>;
}
```

---

## 8. Add API Integration

### Step 1: Create API service
```bash
mkdir src/services
touch src/services/api.js
touch src/services/winsService.js
```

```javascript
// src/services/api.js
import { API_BASE_URL, API_TIMEOUT } from '../constants';

class ApiService {
  constructor(baseURL = API_BASE_URL, timeout = API_TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export default new ApiService();
```

```javascript
// src/services/winsService.js
import api from './api';
import { API_ENDPOINTS } from '../constants';

export const winsService = {
  getAll: () => api.get(API_ENDPOINTS.WINS),
  
  getById: (id) => api.get(`${API_ENDPOINTS.WINS}/${id}`),
  
  create: (win) => api.post(API_ENDPOINTS.WINS, win),
  
  update: (id, win) => api.put(`${API_ENDPOINTS.WINS}/${id}`, win),
  
  delete: (id) => api.delete(`${API_ENDPOINTS.WINS}/${id}`),
};
```

### Step 2: Use in hooks
```javascript
// Update src/hooks/useWins.js to use API
import { useState, useCallback, useEffect } from 'react';
import { winsService } from '../services/winsService';

export const useWins = () => {
  const [wins, setWins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWins();
  }, []);

  const fetchWins = async () => {
    try {
      setLoading(true);
      const data = await winsService.getAll();
      setWins(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addWin = async (winText) => {
    try {
      const newWin = await winsService.create({ text: winText });
      setWins([...wins, newWin]);
    } catch (err) {
      setError(err.message);
    }
  };

  // ... more methods

  return { wins, loading, error, addWin, fetchWins };
};
```

---

## 🎯 Summary

This guide provided copy-paste code for:
- ✅ Reusable components
- ✅ New features
- ✅ Custom hooks
- ✅ Utility functions
- ✅ Constants
- ✅ Routing
- ✅ Global state
- ✅ API integration

**Next:** Follow these patterns and adapt them to your needs! 🚀

---

**Remember:** Always follow the existing project structure and conventions!

