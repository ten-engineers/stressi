import { useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

/**
 * Custom hook for managing wins
 * @returns {object} - Returns wins management functions and state
 */
export const useWins = () => {
  const [wins, setWins] = useLocalStorage('wins', []);
  const [text, setText] = useState('');
  const [error, setError] = useState(false);

  const addWin = useCallback(() => {
    if (text.trim()) {
      const newWin = {
        id: crypto.randomUUID(),
        text: text.trim(),
        date: new Date().toISOString().split('T')[0],
      };

      const updatedWins = [...wins, newWin];
      setWins(updatedWins);
      setText('');
      setError(false);
    } else {
      setError(true);
    }
  }, [text, wins, setWins]);

  const removeWin = useCallback((id) => {
    const updatedWins = wins.filter((win) => win.id !== id);
    setWins(updatedWins);
    setTimeout(() => document.activeElement.blur(), 100);
  }, [wins, setWins]);

  const updateWinText = useCallback((id, newText) => {
    const updatedWins = wins.map((win) =>
      win.id === id ? { ...win, text: newText } : win
    );
    setWins(updatedWins);
  }, [wins, setWins]);

  const updateWinImage = useCallback((id, imageUrl) => {
    const updatedWins = wins.map((win) =>
      win.id === id ? { ...win, image: imageUrl } : win
    );
    setWins(updatedWins);
  }, [wins, setWins]);

  const handleChange = useCallback((event) => {
    setText(event.target.value);
    if (error) setError(false);
  }, [error]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addWin();
    }
  }, [addWin]);

  // Group wins by date
  const groupedWins = useMemo(() => {
    return wins.reduce((acc, win) => {
      acc[win.date] = acc[win.date] || [];
      acc[win.date].push(win);
      return acc;
    }, {});
  }, [wins]);

  return {
    wins,
    text,
    error,
    addWin,
    removeWin,
    updateWinText,
    updateWinImage,
    handleChange,
    handleKeyDown,
    setText,
    groupedWins,
  };
};

