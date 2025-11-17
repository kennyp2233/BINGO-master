/**
 * Image Loader Utility
 * Loads images and converts them to base64 for PDF embedding
 */

/**
 * Load image from URL or import and convert to base64
 * @param {string} imageSrc - Image source (URL or imported image)
 * @returns {Promise<string>} Base64 encoded image
 */
export async function loadImageAsBase64(imageSrc) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const base64 = canvas.toDataURL('image/png');
        resolve(base64);
      } catch (error) {
        reject(new Error(`Failed to convert image to base64: ${error.message}`));
      }
    };

    img.onerror = () => {
      reject(new Error(`Failed to load image: ${imageSrc}`));
    };

    img.src = imageSrc;
  });
}

/**
 * Load multiple images in parallel
 * @param {string[]} imageSources - Array of image sources
 * @returns {Promise<string[]>} Array of base64 encoded images
 */
export async function loadImagesAsBase64(imageSources) {
  return Promise.all(imageSources.map(src => loadImageAsBase64(src)));
}

/**
 * Get image dimensions from base64
 * @param {string} base64Image - Base64 encoded image
 * @returns {Promise<{width: number, height: number}>} Image dimensions
 */
export async function getImageDimensions(base64Image) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };

    img.onerror = () => {
      reject(new Error('Failed to get image dimensions'));
    };

    img.src = base64Image;
  });
}

/**
 * Calculate scaled dimensions while maintaining aspect ratio
 * @param {number} originalWidth - Original width
 * @param {number} originalHeight - Original height
 * @param {number} maxWidth - Maximum width
 * @param {number} maxHeight - Maximum height (optional)
 * @returns {{width: number, height: number}} Scaled dimensions
 */
export function calculateScaledDimensions(originalWidth, originalHeight, maxWidth, maxHeight = null) {
  const aspectRatio = originalWidth / originalHeight;

  let width = maxWidth;
  let height = maxWidth / aspectRatio;

  if (maxHeight && height > maxHeight) {
    height = maxHeight;
    width = maxHeight * aspectRatio;
  }

  return { width, height };
}
