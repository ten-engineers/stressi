# 🎯 Stressi - Daily Wins Tracker

A Progressive Web App (PWA) for tracking your daily wins and achievements. Built with React, Material-UI, and Vite.

## ✨ Features

- 📝 Track daily wins and achievements
- 🌓 Dark/light mode theme
- 📅 Calendar view of your wins
- 💾 Offline support with PWA
- 📱 Mobile-friendly with keyboard handling
- 🔍 Context menu for managing wins (Copy, Edit, Delete, Create Image)
- 🎨 AI-powered image generation from win text (OpenAI DALL-E)
- 📊 Grouped by date for easy viewing

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### AI Image Generation

The app includes AI-powered image generation using OpenAI's DALL-E 2 API. Simply right-click any win and select "Create an image" to generate a visual representation of your achievement!

> **Note**: Image generation uses a shared test API key with limited credits for demo purposes.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

This project follows a scalable, feature-based architecture. See the detailed documentation:

- **[QUICK_START.md](./QUICK_START.md)** - Quick reference for common tasks
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Comprehensive guide to the project structure

### Structure Overview

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── layout/          # Layout components (Header, InputBar)
│   └── features/        # Feature-specific components
│       └── wins/        # Wins management feature
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── constants/           # App-wide constants
├── App.jsx              # Main application
└── main.jsx             # Entry point
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - Component library
- **date-fns** - Date utilities
- **PWA** - Progressive Web App support

## 📚 Documentation

### For Developers

- [Quick Start Guide](./QUICK_START.md) - Get started quickly with common patterns
- [Project Structure](./PROJECT_STRUCTURE.md) - Detailed architecture and how to extend

### Key Concepts

#### Custom Hooks
- `useWins` - Manages wins state and localStorage
- `useTheme` - Theme management
- `useLocalStorage` - Generic localStorage hook
- `useInstallPrompt` - PWA installation
- `useKeyboardHeight` - Mobile keyboard detection

#### Components Organization
- **Common**: Reusable across features (ThemeSwitcher)
- **Layout**: Application structure (Header, InputBar)
- **Features**: Domain-specific (wins/)

## 🎨 How to Extend

### Adding a New Feature

1. Create feature directory:
```bash
mkdir -p src/components/features/your-feature
```

2. Create components and export them
3. Create custom hooks if needed
4. Import and use in App.jsx

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed examples.

## 🤝 Contributing

1. Follow the existing file structure
2. Keep components small and focused
3. Extract reusable logic into hooks
4. Add JSDoc comments for functions
5. Test your changes

## 📝 License

MIT

## 🙏 Acknowledgments

Built with:
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Material-UI](https://mui.com/)
- [date-fns](https://date-fns.org/)

---

**Happy tracking your wins! 🎉**
