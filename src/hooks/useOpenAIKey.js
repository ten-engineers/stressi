import { useLocalStorage } from './useLocalStorage';

/**
 * Custom hook for managing OpenAI API key
 * @returns {object} - Returns API key and setter function
 */
export const useOpenAIKey = () => {
  const [apiKey, setApiKey] = useLocalStorage('openai_api_key', '');

  return {
    apiKey,
    setApiKey,
    hasApiKey: !!apiKey,
  };
};

