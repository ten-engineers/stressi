import { useState } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { format } from 'date-fns';

// Hooks
import { useTheme, useWins, useInstallPrompt, useKeyboardHeight } from './hooks';

// Layout Components
import { Header, InputBar } from './components/layout';

// Feature Components
import { WinsList, WinContextMenu, InstallButton, CalendarModal } from './components/features/wins';

// Styles
import './App.css';

function App() {
  // Custom Hooks
  const { darkMode, setDarkMode, theme } = useTheme();
  const { 
    wins, 
    text, 
    error, 
    addWin, 
    removeWin, 
    updateWinText,
    handleChange, 
    setText,
    groupedWins 
  } = useWins();
  const { isInstallable, handleInstallClick } = useInstallPrompt();
  const keyboardHeight = useKeyboardHeight();

  // Local State
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedWin, setSelectedWin] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editingWin, setEditingWin] = useState(null);

  // Context Menu Handlers
  const handleContextMenu = (event, win) => {
    event.preventDefault();
    setSelectedWin(win);
    setContextMenu(
      contextMenu === null
        ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
        : null
    );
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
    setSelectedWin(null);
  };

  const handleEdit = (win) => {
    setEditingWin(win);
    setText(win.text);
    handleCloseContextMenu();
  };

  const handleSubmit = () => {
    if (editingWin) {
      updateWinText(editingWin.id, text);
      setEditingWin(null);
      setText('');
    } else {
      addWin();
    }
  };

  const handleCancelEdit = () => {
    setEditingWin(null);
    setText('');
  };

  const handleKeyDownWithEdit = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Calendar Handler
  const handleDateSelect = (selectedDate) => {
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const listItem = document.querySelector(`[data-date="${dateString}"]`);
    if (listItem) {
      listItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <Box sx={{ paddingTop: '64px' }} />

      <InstallButton 
        isInstallable={isInstallable} 
        onInstall={handleInstallClick} 
      />

      <InputBar
        text={text}
        error={error}
        darkMode={darkMode}
        keyboardHeight={keyboardHeight}
        onChange={handleChange}
        onKeyDown={handleKeyDownWithEdit}
        onSubmit={handleSubmit}
        isEditing={!!editingWin}
        onCancelEdit={handleCancelEdit}
      />

      <WinsList
        groupedWins={groupedWins}
        darkMode={darkMode}
        onContextMenu={handleContextMenu}
        setCurrentDate={setCurrentDate}
        setIsCalendarOpen={setIsCalendarOpen}
      />

      <CalendarModal
        open={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        wins={wins}
        initialDate={currentDate}
        onDateSelect={handleDateSelect}
      />

      <WinContextMenu
        contextMenu={contextMenu}
        selectedWin={selectedWin}
        onClose={handleCloseContextMenu}
        onDelete={removeWin}
        onEdit={handleEdit}
      />
    </ThemeProvider>
  );
}

export default App;
