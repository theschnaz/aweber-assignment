import JSZip from 'jszip';
import { GenerationOutput } from './types';

export async function createCampaignZip(result: GenerationOutput): Promise<Blob> {
  const zip = new JSZip();

  // Add JSON file with all variations
  const jsonContent = JSON.stringify(result, null, 2);
  zip.file('ad-variations.json', jsonContent);

  // Add images (filter out platforms without images like Google Search)
  const platformsWithImages = result.variations.filter(v => v.image !== null);

  for (const variation of platformsWithImages) {
    if (!variation.image) continue;

    try {
      // Convert base64 to binary
      // Remove data URL prefix if present (data:image/png;base64,)
      const base64Data = variation.image.base64.replace(/^data:image\/\w+;base64,/, '');
      const binaryData = atob(base64Data);
      const bytes = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        bytes[i] = binaryData.charCodeAt(i);
      }

      // Create filename: platform-widthxheight.png
      const filename = `${variation.platform}-${variation.image.width}x${variation.image.height}.png`;
      zip.file(filename, bytes);
    } catch (error) {
      console.warn(`Failed to add image for ${variation.platform}:`, error);
      // Continue with other images
    }
  }

  // Generate zip blob
  const blob = await zip.generateAsync({ type: 'blob' });
  return blob;
}
