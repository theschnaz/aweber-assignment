'use client';

import { useState } from 'react';
import AdInputForm from '@/components/AdInputForm';
import AdVariationCard from '@/components/AdVariationCard';
import LoadingState from '@/components/LoadingState';
import { GenerationOutput } from '@/lib/types';
import { createCampaignZip } from '@/lib/zipUtils';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleGenerate = async (concept: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concept }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate variations');
      }

      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCampaign = async () => {
    if (!result) return;

    setIsDownloading(true);
    setError(null);

    try {
      const zipBlob = await createCampaignZip(result);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `campaign-${Date.now()}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to create campaign zip:', err);
      setError('Failed to create campaign zip. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="border-b border-orange-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🐱</span>
            <div>
              <h1 className="font-bold text-gray-900">Whisker & Paws</h1>
              <p className="text-xs text-gray-500">Ad Variation Generator</p>
            </div>
          </div>
          {result && (
            <button
              onClick={handleReset}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              + New Generation
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero / Input Section */}
        {!result && !isLoading && (
          <div className="py-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                AI-Powered Ad Variation Generator
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                Enter your ad concept and get 5 platform-optimized variations with
                AI-generated images for Google Search, Meta, TikTok, Display, and
                YouTube.
              </p>
            </div>
            <AdInputForm onSubmit={handleGenerate} isLoading={isLoading} />
          </div>
        )}

        {/* Loading State */}
        {isLoading && <LoadingState />}

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-700 font-medium mb-2">Generation Failed</p>
              <p className="text-red-600 text-sm mb-4">{error}</p>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Meta info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div>
                <p className="text-sm text-gray-500">Input Concept:</p>
                <p className="font-medium text-gray-900">
                  &quot;{result.metadata.inputConcept}&quot;
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Generated in {(result.metadata.generationTimeMs / 1000).toFixed(1)}s
                </p>
              </div>
              <button
                onClick={handleDownloadCampaign}
                disabled={isDownloading}
                className={`px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  isDownloading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                {isDownloading ? 'Creating zip...' : 'Download Campaign'}
              </button>
            </div>

            {/* Ad Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {result.variations.map((variation) => (
                <AdVariationCard key={variation.platform} variation={variation} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>
            Built with Next.js, Google Gemini & Imagen 3 | Whisker & Paws Ad Generator
          </p>
        </div>
      </footer>
    </div>
  );
}
