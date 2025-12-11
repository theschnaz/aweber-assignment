export const TEXT_GENERATION_PROMPT = `You are an expert advertising copywriter specializing in direct-to-consumer brands.
Generate ad copy variations for a cat subscription box called "Whisker & Paws".

INPUT CONCEPT: {concept}

Generate ad copy for these 5 platforms with these EXACT specifications:

1. GOOGLE SEARCH ADS (text only):
   - 3 headlines (max 30 characters EACH, count carefully)
   - 2 descriptions (max 90 characters EACH)
   - Display URL path (max 15 characters)
   - NO emojis allowed
   - Focus: Search intent, clear value proposition

2. META (Facebook/Instagram):
   - Primary text (max 125 characters, hook-driven)
   - Headline (max 27 characters)
   - Use emotional language, can use 1-2 relevant emojis
   - Focus: Stopping scroll, emotional connection

3. TIKTOK:
   - Ad text (max 100 characters)
   - Casual, authentic tone
   - Can use emojis and trending language
   - Focus: Native feel, entertainment value

4. DISPLAY/BANNER:
   - Headline (max 30 characters)
   - Description (max 90 characters)
   - CTA (max 15 characters)
   - Focus: Clear, punchy, scannable

5. YOUTUBE:
   - Headline (max 40 characters)
   - Description (max 90 characters)
   - Focus: Curiosity, value proposition

IMPORTANT RULES:
- Count characters EXACTLY (spaces count!)
- Each variation must be unique, not just reformatted
- Emphasize subscription value, cat happiness, convenience
- Include urgency or exclusivity where appropriate
- Target audience: Cat owners aged 25-45

Return ONLY valid JSON matching this exact structure (no markdown, no code blocks):
{
  "google_search": {
    "headlines": ["headline1", "headline2", "headline3"],
    "descriptions": ["description1", "description2"],
    "displayUrl": "path"
  },
  "meta": {
    "primaryText": "text here",
    "headline": "headline here"
  },
  "tiktok": {
    "adText": "text here"
  },
  "display": {
    "headline": "headline here",
    "description": "description here",
    "cta": "CTA here"
  },
  "youtube": {
    "headline": "headline here",
    "description": "description here"
  }
}`;

export const getImagePrompt = (platform: string, concept: string): string => {
  const prompts: Record<string, string> = {
    meta: `Create a professional advertising image for a cat subscription box brand called "Whisker & Paws".

CONCEPT: ${concept}

IMAGE REQUIREMENTS:
- Show a happy, photogenic cat (tabby, orange, or mixed breed) interacting with colorful toys
- Include an attractive subscription box in the scene
- Bright, warm lighting with soft shadows
- Clean, uncluttered background (soft neutral or pastel)
- High-end product photography style
- Cat should appear joyful and engaged
- Include some scattered treats and toys around the box
- Professional, aspirational lifestyle feel
- NO TEXT OR WORDS IN THE IMAGE
- Photorealistic style

Mood: Joyful, premium, heartwarming
Color palette: Warm neutrals with pops of color from toys`,

    tiktok: `Create a vibrant, attention-grabbing vertical image for a TikTok ad promoting a cat subscription box.

CONCEPT: ${concept}

IMAGE REQUIREMENTS:
- Dynamic, energetic composition suited for vertical/mobile viewing
- Cute cat in an excited or playful pose
- Colorful toys and treats scattered creatively
- Subscription box as focal point
- Bright, saturated colors that pop on mobile screens
- Fun, youthful aesthetic
- Cat should look surprised or delighted
- NO TEXT OR WORDS IN THE IMAGE
- Keep important elements in center (safe zone)
- Photorealistic but can have slight stylization

Mood: Fun, exciting, shareable
Style: Modern, eye-catching, scroll-stopping`,

    display: `Create a clean, impactful banner ad image for a cat subscription box.

CONCEPT: ${concept}

IMAGE REQUIREMENTS:
- Simple, focused composition
- Cute cat face or cat with single toy
- Subscription box visible
- Clean background that allows text overlay
- High contrast for visibility at small sizes
- Professional product shot feel
- Ample negative space on one side for text
- NO TEXT OR WORDS IN THE IMAGE
- Photorealistic

Mood: Premium, trustworthy, appealing
Note: Image will be used at small sizes, keep it simple`,

    youtube: `Create a cinematic, wide-format image for a YouTube ad about a cat subscription box.

CONCEPT: ${concept}

IMAGE REQUIREMENTS:
- Widescreen/cinematic composition (16:9)
- Happy cat in a cozy home environment
- Subscription box with toys spilling out
- Warm, inviting home setting (living room, cozy corner)
- Soft, natural lighting
- Premium lifestyle photography feel
- Cat should be the star, looking content
- NO TEXT OR WORDS IN THE IMAGE
- Photorealistic with warm color grading

Mood: Cozy, aspirational, heartwarming
Setting: Modern, tasteful home interior`,
  };

  return prompts[platform] || prompts.meta;
};
