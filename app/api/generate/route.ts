import { NextRequest, NextResponse } from 'next/server';
import { generateAdCopy, generateAllImages } from '@/lib/gemini';
import { PLATFORM_SPECS, PLATFORM_ORDER } from '@/lib/platforms';
import { AdVariation, GenerationOutput, GenerateRequest } from '@/lib/types';

export const maxDuration = 60; // Allow up to 60 seconds for image generation

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: GenerateRequest = await request.json();
    const { concept, brandName = 'Whisker & Paws' } = body;

    if (!concept || concept.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Concept must be at least 10 characters' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'GEMINI_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Generate text and images in parallel
    const [textVariations, images] = await Promise.all([
      generateAdCopy(concept),
      generateAllImages(concept),
    ]);

    // Assemble the output
    const variations: AdVariation[] = PLATFORM_ORDER.map((platformId) => {
      const spec = PLATFORM_SPECS[platformId];
      const copyData = textVariations[platformId as keyof typeof textVariations];
      const imageData = images[platformId];

      const copyLimits: Record<string, number> = {};
      Object.entries(spec.copy).forEach(([key, value]) => {
        copyLimits[key] = value.maxLength;
      });

      return {
        platform: platformId,
        platformName: spec.name,
        type: spec.type,
        copy: copyData,
        image: imageData
          ? {
              base64: imageData.base64,
              mimeType: imageData.mimeType,
              aspectRatio: spec.image?.aspectRatio || '',
              width: spec.image?.width || 0,
              height: spec.image?.height || 0,
              prompt: `Generated for ${spec.name}`,
            }
          : null,
        specs: {
          copyLimits,
          imageDimensions: spec.image
            ? `${spec.image.width}x${spec.image.height}`
            : null,
        },
      };
    });

    const output: GenerationOutput = {
      metadata: {
        generatedAt: new Date().toISOString(),
        inputConcept: concept,
        brandName,
        generationTimeMs: Date.now() - startTime,
      },
      variations,
    };

    return NextResponse.json({ success: true, data: output });
  } catch (error) {
    console.error('Generation failed:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to generate ad variations',
      },
      { status: 500 }
    );
  }
}
