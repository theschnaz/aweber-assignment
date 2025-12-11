export interface PlatformSpec {
  id: string;
  name: string;
  type: 'text_only' | 'image_and_text';
  copy: {
    [key: string]: {
      maxLength: number;
      count?: number;
    };
  };
  image: {
    aspectRatio: string;
    width: number;
    height: number;
  } | null;
}

export const PLATFORM_SPECS: Record<string, PlatformSpec> = {
  google_search: {
    id: 'google_search',
    name: 'Google Search Ads',
    type: 'text_only',
    copy: {
      headline: { maxLength: 30, count: 3 },
      description: { maxLength: 90, count: 2 },
      displayUrl: { maxLength: 15 },
    },
    image: null,
  },
  meta: {
    id: 'meta',
    name: 'Meta (Facebook/Instagram)',
    type: 'image_and_text',
    copy: {
      primaryText: { maxLength: 125 },
      headline: { maxLength: 27 },
    },
    image: {
      aspectRatio: '1:1',
      width: 1080,
      height: 1080,
    },
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    type: 'image_and_text',
    copy: {
      adText: { maxLength: 100 },
    },
    image: {
      aspectRatio: '9:16',
      width: 1080,
      height: 1920,
    },
  },
  display: {
    id: 'display',
    name: 'Display/Banner Ads',
    type: 'image_and_text',
    copy: {
      headline: { maxLength: 30 },
      description: { maxLength: 90 },
      cta: { maxLength: 15 },
    },
    image: {
      aspectRatio: '1:1',
      width: 300,
      height: 250,
    },
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    type: 'image_and_text',
    copy: {
      headline: { maxLength: 40 },
      description: { maxLength: 90 },
    },
    image: {
      aspectRatio: '16:9',
      width: 1280,
      height: 720,
    },
  },
};

export const PLATFORM_ORDER = ['google_search', 'meta', 'tiktok', 'display', 'youtube'];
