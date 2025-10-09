/**
 * Format a date string to DD.MM.YY format
 * @param {string} dateString - ISO date string (YYYY-MM-DD)
 * @returns {string} - Formatted date string
 */
export const formatDateShort = (dateString) => {
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(2);
  return `${day}.${month}.${year}`;
};

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 * @returns {string} - Today's date
 */
export const getTodayISO = () => {
  return new Date().toISOString().split('T')[0];
};

