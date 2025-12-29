/**
 * Application-wide constants
 */

export const APP_NAME = 'Stressi';

export const STORAGE_KEYS = {
  WINS: 'wins',
  THEME: 'theme',
};

export const KEYBOARD_THRESHOLD = 150; // Minimum height difference to consider keyboard open

export const CALENDAR_MONTHS_BACK = 73; // Number of months to show in calendar

// OpenAI API Key from environment variable
export const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

