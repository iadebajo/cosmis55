/**
 * Utilities for image processing, background removal, and high-res canvas exports
 */

/**
 * Removes white or light background from an image using canvas pixel manipulation
 */
export async function removeLightBackground(
  imageUrl: string,
  threshold: number = 230
): Promise<string> {
  return new Promise((resolve) => {
    if (!imageUrl) {
      resolve('');
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width || 400;
        canvas.height = img.naturalHeight || img.height || 400;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(imageUrl);
          return;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          const a = data[i + 3];
          if (a === 0) continue; // Already transparent

          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Check if pixel is near-white or light gray
          if (r > threshold && g > threshold && b > threshold) {
            // Calculate softness fade near edges
            const minVal = Math.min(r, g, b);
            const diff = minVal - threshold;
            const range = Math.max(1, 255 - threshold);
            const alphaFade = Math.max(0, 1 - diff / range);
            data[i + 3] = Math.round(a * alphaFade);
          }
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        console.warn('Could not remove background:', err);
        resolve(imageUrl);
      }
    };
    img.onerror = () => {
      resolve(imageUrl);
    };
    img.src = imageUrl;
  });
}

/**
 * Recolor an image (e.g. for monochrome white, black, gold, or custom brand color)
 */
export async function recolorImage(
  imageUrl: string,
  targetColor: string // hex or rgb
): Promise<string> {
  return new Promise((resolve) => {
    if (!imageUrl) {
      resolve('');
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width || 400;
        canvas.height = img.naturalHeight || img.height || 400;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(imageUrl);
          return;
        }

        // Draw original
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Composite with color
        ctx.globalCompositeOperation = 'source-in';
        ctx.fillStyle = targetColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        console.warn('Could not recolor image:', err);
        resolve(imageUrl);
      }
    };
    img.onerror = () => resolve(imageUrl);
    img.src = imageUrl;
  });
}

/**
 * Downloads a canvas or data URL as a PNG file
 */
export function downloadImage(dataUrl: string, filename: string = 'product-mockup.png') {
  try {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Download image failed:', err);
  }
}
