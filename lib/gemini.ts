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

  // Use Imagen 3 for image generation
  const model = genAI.getGenerativeModel({
    model: 'imagen-3.0-generate-002',
  });

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: imagePrompt }] }],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    generationConfig: {
      responseModalities: ['IMAGE'],
      imageSizeConfig: {
        aspectRatio: spec.image.aspectRatio,
      },
    } as any,
  });

  const response = result.response;
  const candidate = response.candidates?.[0];

  if (!candidate?.content?.parts) {
    throw new Error('No image generated');
  }

  const imagePart = candidate.content.parts.find(
    (part: { inlineData?: { data: string; mimeType: string } }) => part.inlineData
  );

  if (!imagePart?.inlineData) {
    throw new Error('No image data in response');
  }

  return {
    base64: imagePart.inlineData.data,
    mimeType: imagePart.inlineData.mimeType,
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
