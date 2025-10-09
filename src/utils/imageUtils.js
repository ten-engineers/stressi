import { OPENAI_API_KEY } from '../constants';
import { saveImageToIndexedDB } from './indexedDB';

/**
 * Generate an image using OpenAI's DALL-E API and save it to IndexedDB
 * @param {string} prompt - The text prompt to generate the image
 * @param {string} winId - The win ID to use as the storage key
 * @returns {Promise<void>}
 */
export const generateImage = async (prompt, winId) => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }
  
  const apiKey = OPENAI_API_KEY;

  try {
    // Generate image with OpenAI - request base64 format to avoid CORS issues
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-2',
        prompt: prompt,
        n: 1,
        size: '256x256',
        response_format: 'b64_json', // Request base64 instead of URL
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate image');
    }

    const data = await response.json();
    const base64Image = data.data[0].b64_json;

    // Convert base64 to blob
    const byteCharacters = atob(base64Image);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });

    // Save to IndexedDB
    await saveImageToIndexedDB(winId, blob);

  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};

