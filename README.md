# Whisker & Paws Ad Variation Generator

AI-powered ad variation generator that takes a single ad concept and generates 5 platform-optimized variations with AI-generated images.

## Features

- **5 Platform Variations**: Google Search, Meta (Facebook/Instagram), TikTok, Display/Banner, YouTube
- **AI-Generated Images**: Platform-specific images with correct dimensions using Imagen 3
- **Smart Copy**: Character-limited ad copy optimized for each platform
- **Structured Output**: Download results as JSON for easy integration

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Text**: Google Gemini 2.0 Flash
- **AI Images**: Google Imagen 3
- **Hosting**: Vercel

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/aweber-assignment.git
cd aweber-assignment
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Gemini API key to `.env.local`:
```
GEMINI_API_KEY=your_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Platform Specifications

| Platform | Image Size | Key Copy Limits |
|----------|------------|-----------------|
| Google Search | None | Headlines: 30 chars, Descriptions: 90 chars |
| Meta | 1080x1080 | Primary: 125 chars, Headline: 27 chars |
| TikTok | 1080x1920 | Ad Text: 100 chars |
| Display | 300x250 | Headline: 30 chars, Description: 90 chars |
| YouTube | 1280x720 | Headline: 40 chars, Description: 90 chars |

## Project Structure

```
├── app/
│   ├── api/generate/route.ts  # API endpoint
│   ├── page.tsx               # Main UI
│   └── layout.tsx             # Root layout
├── components/
│   ├── AdInputForm.tsx        # Input form
│   ├── AdVariationCard.tsx    # Result cards
│   └── LoadingState.tsx       # Loading skeleton
├── lib/
│   ├── gemini.ts              # AI client
│   ├── prompts.ts             # Prompt templates
│   ├── platforms.ts           # Platform specs
│   └── types.ts               # TypeScript types
└── document.txt               # Full documentation
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project to Vercel
3. Add `GEMINI_API_KEY` to Environment Variables
4. Deploy

## API Usage

```bash
POST /api/generate
Content-Type: application/json

{
  "concept": "Monthly surprise toys and treats for your cat"
}
```

## Documentation

See [document.txt](./document.txt) for complete documentation including:
- All prompts used
- Example output
- Approach explanation
- Future optimization ideas

## License

MIT
