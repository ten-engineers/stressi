import { useState, useEffect } from 'react';

/**
 * Custom hook for detecting mobile keyboard height
 * Useful for adjusting UI when virtual keyboard appears
 * @returns {number} - The keyboard height in pixels
 */
export const useKeyboardHeight = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const handleVisualViewportChange = () => {
      if (window.visualViewport) {
        const heightDiff = window.innerHeight - window.visualViewport.height;
        setKeyboardHeight(heightDiff > 150 ? heightDiff : 0);
      }
    };

    const handleResize = () => {
      // Fallback for devices without Visual Viewport API
      if (!window.visualViewport) {
        const heightDiff = window.screen.height - window.innerHeight;
        setKeyboardHeight(heightDiff > 150 ? heightDiff : 0);
      }
    };

    // Initial check
    handleVisualViewportChange();

    // Listen for viewport changes
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportChange);
    } else {
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleVisualViewportChange);
      } else {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  return keyboardHeight;
};

