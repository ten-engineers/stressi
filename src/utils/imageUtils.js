import { OPENAI_API_KEY } from '../constants';

/**
 * Generate an image using OpenAI's DALL-E API
 * @param {string} prompt - The text prompt to generate the image
 * @returns {Promise<string>} - The URL of the generated image
 */
export const generateImage = async (prompt) => {gpt-image-1
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }
  
  const apiKey = OPENAI_API_KEY;

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: prompt,
        n: 1,
        size: '256x256',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate image');
    }

    const data = await response.json();
    return data.data[0].url;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};

