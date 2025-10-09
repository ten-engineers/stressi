import { useState, useEffect, useMemo } from 'react';
import { useMediaQuery, createTheme } from '@mui/material';

/**
 * Custom hook for managing theme (dark/light mode)
 * @returns {object} - Returns { darkMode, setDarkMode, theme }
 */
export const useTheme = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme ? storedTheme === 'dark' : prefersDarkMode;
  });

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode]
  );

  return { darkMode, setDarkMode, theme };
};

