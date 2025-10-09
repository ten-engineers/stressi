/**
 * IndexedDB utility for storing generated images
 */

const DB_NAME = 'StressiDB';
const DB_VERSION = 1;
const STORE_NAME = 'images';

/**
 * Initialize IndexedDB
 * @returns {Promise<IDBDatabase>}
 */
const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

/**
 * Save image blob to IndexedDB
 * @param {string} id - Unique identifier for the image (win ID)
 * @param {Blob} blob - Image blob to store
 * @returns {Promise<void>}
 */
export const saveImageToIndexedDB = async (id, blob) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({ id, blob });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

/**
 * Get image blob from IndexedDB
 * @param {string} id - Unique identifier for the image (win ID)
 * @returns {Promise<Blob|null>}
 */
export const getImageFromIndexedDB = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      const result = request.result;
      resolve(result ? result.blob : null);
    };
    request.onerror = () => reject(request.error);
  });
};

/**
 * Delete image from IndexedDB
 * @param {string} id - Unique identifier for the image (win ID)
 * @returns {Promise<void>}
 */
export const deleteImageFromIndexedDB = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

/**
 * Check if image exists in IndexedDB
 * @param {string} id - Unique identifier for the image (win ID)
 * @returns {Promise<boolean>}
 */
export const hasImageInIndexedDB = async (id) => {
  try {
    const blob = await getImageFromIndexedDB(id);
    return blob !== null;
  } catch (error) {
    console.error('Error checking image in IndexedDB:', error);
    return false;
  }
};

