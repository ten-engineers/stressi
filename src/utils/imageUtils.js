import { saveImageToIndexedDB } from './indexedDB';

/**
 * Generate a styled image from text prompt (free, client-side, no API needed)
 * Creates an attractive gradient image with the prompt text
 * @param {string} prompt - The text prompt to generate the image
 * @param {string} winId - The win ID to use as the storage key
 * @returns {Promise<void>}
 */
export const generateImage = async (prompt, winId) => {
  try {
    // Create a canvas for image generation
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Generate a consistent color scheme based on prompt hash
    const hash = prompt.split('').reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0);
    }, 0);
    
    const hue1 = Math.abs(hash % 360);
    const hue2 = (hue1 + 60) % 360;
    const hue3 = (hue1 + 120) % 360;
    
    // Create an attractive multi-color gradient background
    const gradient = ctx.createLinearGradient(0, 0, 512, 512);
    gradient.addColorStop(0, `hsl(${hue1}, 70%, 55%)`);
    gradient.addColorStop(0.5, `hsl(${hue2}, 70%, 50%)`);
    gradient.addColorStop(1, `hsl(${hue3}, 70%, 45%)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    
    // Add decorative geometric shapes
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    for (let i = 0; i < 8; i++) {
      const angle = (hash + i * 45) % 360;
      const radius = 40 + (hash % 60);
      const x = 256 + Math.cos(angle * Math.PI / 180) * (150 + i * 20);
      const y = 256 + Math.sin(angle * Math.PI / 180) * (150 + i * 20);
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Add some smaller accent circles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    for (let i = 0; i < 12; i++) {
      const x = (hash + i * 73) % 512;
      const y = (hash + i * 127) % 512;
      const radius = 15 + (hash % 25);
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Add text with professional styling
    ctx.fillStyle = 'white';
    ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Word wrap text to fit canvas
    const words = prompt.split(' ');
    const lines = [];
    let currentLine = '';
    const maxWidth = 440;
    const fontSize = 32;
    
    // Measure text width for wrapping
    ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    
    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    
    // Add text shadow for better readability
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    
    // Draw text lines
    const lineHeight = 40;
    const totalHeight = (lines.length - 1) * lineHeight;
    const startY = (512 - totalHeight) / 2;
    
    lines.forEach((line, index) => {
      ctx.fillText(line, 256, startY + index * lineHeight);
    });
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Convert canvas to blob
    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/png', 0.95);
    });

    // Save to IndexedDB
    await saveImageToIndexedDB(winId, blob);

  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};

