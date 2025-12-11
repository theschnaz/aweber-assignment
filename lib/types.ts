export interface GoogleSearchCopy {
  headlines: string[];
  descriptions: string[];
  displayUrl: string;
}

export interface MetaCopy {
  primaryText: string;
  headline: string;
}

export interface TikTokCopy {
  adText: string;
}

export interface DisplayCopy {
  headline: string;
  description: string;
  cta: string;
}

export interface YouTubeCopy {
  headline: string;
  description: string;
}

export interface TextVariations {
  google_search: GoogleSearchCopy;
  meta: MetaCopy;
  tiktok: TikTokCopy;
  display: DisplayCopy;
  youtube: YouTubeCopy;
}

export interface GeneratedImage {
  base64: string;
  mimeType: string;
  aspectRatio: string;
  width: number;
  height: number;
  prompt: string;
}

export interface AdVariation {
  platform: string;
  platformName: string;
  type: 'text_only' | 'image_and_text';
  copy: GoogleSearchCopy | MetaCopy | TikTokCopy | DisplayCopy | YouTubeCopy;
  image: GeneratedImage | null;
  specs: {
    copyLimits: Record<string, number>;
    imageDimensions: string | null;
  };
}

export interface GenerationOutput {
  metadata: {
    generatedAt: string;
    inputConcept: string;
    brandName: string;
    generationTimeMs: number;
  };
  variations: AdVariation[];
}

export interface GenerateRequest {
  concept: string;
  brandName?: string;
}

export interface GenerateResponse {
  success: boolean;
  data?: GenerationOutput;
  error?: string;
}
