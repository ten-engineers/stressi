import { useState, useEffect } from 'react';
import { getImageFromIndexedDB } from '../utils';

/**
 * Custom hook to load and manage win images from IndexedDB
 * @param {string} winId - The win ID to load the image for
 * @param {boolean} hasImage - Whether the win has an associated image
 * @returns {string|null} - Object URL for the image or null
 */
export const useWinImage = (winId, hasImage) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    let objectUrl = null;

    const loadImage = async () => {
      if (!hasImage || !winId) {
        setImageUrl(null);
        return;
      }

      try {
        const blob = await getImageFromIndexedDB(winId);
        if (blob) {
          objectUrl = URL.createObjectURL(blob);
          setImageUrl(objectUrl);
        }
      } catch (error) {
        console.error('Error loading image from IndexedDB:', error);
        setImageUrl(null);
      }
    };

    loadImage();

    // Cleanup: revoke object URL when component unmounts or winId changes
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [winId, hasImage]);

  return imageUrl;
};

