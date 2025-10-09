import { useState } from 'react';
import { ThemeProvider, CssBaseline, Box, Snackbar, Alert } from '@mui/material';
import { format } from 'date-fns';

// Hooks
import { useTheme, useWins, useInstallPrompt, useKeyboardHeight } from './hooks';

// Layout Components
import { Header, InputBar } from './components/layout';

// Feature Components
import { WinsList, WinContextMenu, InstallButton, CalendarModal } from './components/features/wins';

// Utils
import { generateImage } from './utils';

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
    updateWinImage,
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
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

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

  // Image Generation Handler
  const handleCreateImage = async (win) => {
    setIsGeneratingImage(true);
    try {
      await generateImage(win.text, win.id);
      updateWinImage(win.id, true);
      setSnackbar({
        open: true,
        message: 'Image generated successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Failed to generate image:', error);
      setSnackbar({
        open: true,
        message: `Failed to generate image: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <InstallButton 
        isInstallable={isInstallable} 
        onInstall={handleInstallClick} 
      />

      <InputBar
        text={text}
        error={error}
        darkMode={darkMode}
        onChange={handleChange}
        onKeyDown={handleKeyDownWithEdit}
        onSubmit={handleSubmit}
        isEditing={!!editingWin}
        onCancelEdit={handleCancelEdit}
      />

      <Box sx={{ 
        paddingTop: '80px', 
        paddingBottom: '100px',
        height: 'calc(100vh - 180px)'
      }}>
        <WinsList
          groupedWins={groupedWins}
          darkMode={darkMode}
          onContextMenu={handleContextMenu}
          setCurrentDate={setCurrentDate}
          setIsCalendarOpen={setIsCalendarOpen}
        />
      </Box>

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
        onCreateImage={handleCreateImage}
        isGeneratingImage={isGeneratingImage}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
