import { GoogleGenerativeAI } from '@google/generative-ai';
import { TextVariations } from './types';
import { TEXT_GENERATION_PROMPT, getImagePrompt } from './prompts';
import { PLATFORM_SPECS } from './platforms';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateAdCopy(concept: string): Promise<TextVariations> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });

  const prompt = TEXT_GENERATION_PROMPT.replace('{concept}', concept);
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    return JSON.parse(text) as TextVariations;
  } catch {
    // If JSON parsing fails, try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as TextVariations;
    }
    throw new Error('Failed to parse ad copy response');
  }
}

export async function generateAdImage(
  platform: string,
  concept: string
): Promise<{ base64: string; mimeType: string }> {
  const imagePrompt = getImagePrompt(platform, concept);
  const spec = PLATFORM_SPECS[platform];

  if (!spec?.image) {
    throw new Error(`Platform ${platform} does not support images`);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  // Use Imagen 4 with :predict endpoint
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [{ prompt: imagePrompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: spec.image.aspectRatio,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Image generation error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  if (!data.predictions || data.predictions.length === 0) {
    throw new Error('No image generated');
  }

  const imageData = data.predictions[0].bytesBase64Encoded;
  if (!imageData) {
    throw new Error('No image data in response');
  }

  return {
    base64: imageData,
    mimeType: 'image/png',
  };
}

export async function generateAllImages(
  concept: string
): Promise<Record<string, { base64: string; mimeType: string } | null>> {
  const platformsWithImages = ['meta', 'tiktok', 'display', 'youtube'];

  const results = await Promise.allSettled(
    platformsWithImages.map(async (platform) => {
      const image = await generateAdImage(platform, concept);
      return { platform, image };
    })
  );

  const images: Record<string, { base64: string; mimeType: string } | null> = {
    google_search: null,
  };

  for (const result of results) {
    if (result.status === 'fulfilled') {
      images[result.value.platform] = result.value.image;
    } else {
      // Log error but don't fail the entire generation
      console.error(`Failed to generate image for platform:`, result.reason);
      const platform = platformsWithImages[results.indexOf(result)];
      images[platform] = null;
    }
  }

  return images;
}
