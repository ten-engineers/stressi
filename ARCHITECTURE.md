# 🏛️ Architecture Overview

## Design Principles

This project follows these key architectural principles:

### 1. **Separation of Concerns**
Each part of the application has a clear responsibility:
- **Components**: UI rendering
- **Hooks**: Business logic and state management
- **Utils**: Pure functions and helpers
- **Constants**: Configuration values

### 2. **Component Composition**
Build complex UIs from simple, reusable components:
```
App
├── Header
│   └── ThemeSwitcher
├── InstallButton
├── InputBar
├── WinsList
│   └── (maps over wins)
├── CalendarModal
└── WinContextMenu
```

### 3. **Custom Hooks Pattern**
Extract reusable logic into custom hooks:
- Keeps components clean and focused on UI
- Makes logic testable and reusable
- Follows React best practices

### 4. **Feature-Based Organization**
Group related components by feature:
```
features/
└── wins/
    ├── WinsList.jsx
    ├── WinContextMenu.jsx
    ├── CalendarModal.jsx
    └── InstallButton.jsx
```

## Data Flow

```
┌─────────────────────────────────────────┐
│              App.jsx                    │
│  (Orchestrates all features)            │
└──────────────┬──────────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
    ▼                     ▼
┌─────────┐         ┌──────────────┐
│  Hooks  │         │  Components  │
│         │         │              │
│ useWins ├────────►│  WinsList    │
│ useTheme│         │  InputBar    │
│ etc.    │         │  Header      │
└────┬────┘         └──────────────┘
     │
     ▼
┌─────────────┐
│ localStorage│
└─────────────┘
```

## State Management Strategy

### Local Component State
Use `useState` for UI-only state:
- Modal open/closed
- Form inputs
- Temporary UI states

### Custom Hooks for Feature State
Use custom hooks for feature-specific state:
- `useWins()` - Manages wins data
- `useTheme()` - Manages theme
- Encapsulates logic and side effects

### Context API (Future)
For truly global state needed everywhere:
- User authentication
- App-wide settings
- Not needed yet - keep it simple!

## File Organization Logic

### Why this structure?

**`components/common/`**
- Used in multiple features
- No business logic
- Pure presentational
- Example: ThemeSwitcher

**`components/layout/`**
- Define app structure
- Usually one per page section
- Example: Header, Footer, Sidebar

**`components/features/`**
- Domain-specific
- Contains feature logic
- Self-contained
- Example: wins/

**`hooks/`**
- Reusable logic
- State + side effects
- Easy to test
- Example: useWins, useTheme

**`utils/`**
- Pure functions
- No React dependencies
- Helper functions
- Example: date formatting

**`constants/`**
- Configuration
- Magic numbers → named constants
- Easy to maintain
- Example: APP_NAME, STORAGE_KEYS

## Component Patterns

### Container/Presentational Pattern

**Container (Smart Component):**
```jsx
// Handles logic, state, side effects
const WinsContainer = () => {
  const { wins, addWin } = useWins();
  return <WinsList wins={wins} onAdd={addWin} />;
};
```

**Presentational (Dumb Component):**
```jsx
// Only receives props, renders UI
const WinsList = ({ wins, onAdd }) => {
  return <div>{wins.map(win => ...)}</div>;
};
```

### Custom Hook Pattern

Extract logic from components:

**Before:**
```jsx
const MyComponent = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // 50 lines of logic
  }, []);
  
  const handleAdd = () => {
    // 30 lines of logic
  };
  
  return <div>...</div>;
};
```

**After:**
```jsx
const MyComponent = () => {
  const { data, handleAdd } = useMyFeature();
  return <div>...</div>;
};
```

## Scalability Considerations

### Current: Small App (< 10 features)
✅ Custom hooks for state
✅ Props for component communication
✅ Feature-based organization

### Growing: Medium App (10-30 features)
Consider adding:
- React Router for multiple pages
- Context API for shared state
- More granular feature splitting

### Large: Enterprise App (30+ features)
Consider:
- State management library (Redux, Zustand)
- Micro-frontends
- Feature flags
- Testing strategies

## Performance Patterns

### Already Implemented

1. **useMemo** - Expensive calculations (groupedWins)
2. **useCallback** - Stable function references
3. **Lazy Loading** - Code splitting potential

### Future Optimizations

1. **React.memo** - Prevent unnecessary re-renders
2. **Virtual scrolling** - For very long lists
3. **Suspense** - For async operations

## Testing Strategy (Recommended)

```
src/
├── components/
│   └── __tests__/
├── hooks/
│   └── __tests__/
└── utils/
    └── __tests__/
```

**Test levels:**
1. Unit tests - Hooks and utils
2. Component tests - UI components
3. Integration tests - Feature flows
4. E2E tests - Critical user paths

## Extension Points

The architecture makes it easy to add:

1. **New Features**
   - Create in `features/`
   - Add custom hook
   - Import in App

2. **Authentication**
   - Create `auth/` context
   - Add useAuth hook
   - Wrap App in provider

3. **API Integration**
   - Create `services/` folder
   - Add API clients
   - Use in hooks

4. **Routing**
   - Create `pages/` folder
   - Add React Router
   - Update App.jsx

## Best Practices Summary

✅ **DO:**
- Keep components small (< 200 lines)
- Extract logic to hooks
- Use meaningful names
- Comment complex logic
- Follow existing patterns

❌ **DON'T:**
- Mix business logic in components
- Create deeply nested folders
- Use magic numbers/strings
- Duplicate code
- Overcomplicate early

---

This architecture balances **simplicity** with **scalability**. Start simple, add complexity only when needed. 🚀

