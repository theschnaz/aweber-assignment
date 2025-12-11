'use client';

import { useState } from 'react';

interface AdInputFormProps {
  onSubmit: (concept: string) => void;
  isLoading: boolean;
}

export default function AdInputForm({ onSubmit, isLoading }: AdInputFormProps) {
  const [concept, setConcept] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (concept.trim().length >= 10) {
      onSubmit(concept.trim());
    }
  };

  const exampleConcepts = [
    'Monthly surprise toys and treats for your cat',
    'Premium subscription box with vet-approved toys',
    'Make your cat happy with curated monthly surprises',
  ];

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="mb-4">
        <label
          htmlFor="concept"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Enter your ad concept
        </label>
        <textarea
          id="concept"
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          placeholder="e.g., Monthly surprise toys and treats for your cat"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-gray-900"
          rows={3}
          disabled={isLoading}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">
            {concept.length} characters (min 10)
          </span>
          {concept.length < 10 && concept.length > 0 && (
            <span className="text-xs text-red-500">
              Need {10 - concept.length} more characters
            </span>
          )}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-xs text-gray-500 mb-2">Try an example:</p>
        <div className="flex flex-wrap gap-2">
          {exampleConcepts.map((example, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setConcept(example)}
              className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
              disabled={isLoading}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={concept.trim().length < 10 || isLoading}
        className="w-full py-3 px-6 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Generating 5 Ad Variations...
          </>
        ) : (
          'Generate 5 Ad Variations'
        )}
      </button>
    </form>
  );
}
