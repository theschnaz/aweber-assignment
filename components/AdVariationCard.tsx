'use client';

import { AdVariation } from '@/lib/types';

interface AdVariationCardProps {
  variation: AdVariation;
}

const platformIcons: Record<string, string> = {
  google_search: 'G',
  meta: 'f',
  tiktok: 'T',
  display: 'D',
  youtube: 'Y',
};

const platformColors: Record<string, string> = {
  google_search: 'bg-blue-500',
  meta: 'bg-blue-600',
  tiktok: 'bg-black',
  display: 'bg-green-500',
  youtube: 'bg-red-500',
};

export default function AdVariationCard({ variation }: AdVariationCardProps) {
  const renderCopy = () => {
    const copy = variation.copy;

    if (variation.platform === 'google_search') {
      const gsCopy = copy as {
        headlines: string[];
        descriptions: string[];
        displayUrl: string;
      };
      return (
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">
              Headlines
            </p>
            {gsCopy.headlines.map((h, i) => (
              <p key={i} className="text-blue-600 text-sm font-medium">
                {h}{' '}
                <span className="text-gray-400 text-xs">({h.length}/30)</span>
              </p>
            ))}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">
              Descriptions
            </p>
            {gsCopy.descriptions.map((d, i) => (
              <p key={i} className="text-gray-700 text-sm">
                {d}{' '}
                <span className="text-gray-400 text-xs">({d.length}/90)</span>
              </p>
            ))}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">
              Display URL
            </p>
            <p className="text-green-700 text-sm">
              whiskerandpaws.com/{gsCopy.displayUrl}
            </p>
          </div>
        </div>
      );
    }

    if (variation.platform === 'meta') {
      const metaCopy = copy as { primaryText: string; headline: string };
      return (
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">
              Primary Text
            </p>
            <p className="text-gray-700 text-sm">
              {metaCopy.primaryText}{' '}
              <span className="text-gray-400 text-xs">
                ({metaCopy.primaryText.length}/125)
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">
              Headline
            </p>
            <p className="text-gray-900 font-semibold text-sm">
              {metaCopy.headline}{' '}
              <span className="text-gray-400 text-xs font-normal">
                ({metaCopy.headline.length}/27)
              </span>
            </p>
          </div>
        </div>
      );
    }

    if (variation.platform === 'tiktok') {
      const ttCopy = copy as { adText: string };
      return (
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase mb-1">
            Ad Text
          </p>
          <p className="text-gray-700 text-sm">
            {ttCopy.adText}{' '}
            <span className="text-gray-400 text-xs">
              ({ttCopy.adText.length}/100)
            </span>
          </p>
        </div>
      );
    }

    if (variation.platform === 'display') {
      const dispCopy = copy as {
        headline: string;
        description: string;
        cta: string;
      };
      return (
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">
              Headline
            </p>
            <p className="text-gray-900 font-semibold text-sm">
              {dispCopy.headline}{' '}
              <span className="text-gray-400 text-xs font-normal">
                ({dispCopy.headline.length}/30)
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">
              Description
            </p>
            <p className="text-gray-700 text-sm">
              {dispCopy.description}{' '}
              <span className="text-gray-400 text-xs">
                ({dispCopy.description.length}/90)
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">
              CTA
            </p>
            <span className="inline-block px-3 py-1 bg-orange-500 text-white text-xs font-medium rounded">
              {dispCopy.cta}
            </span>
          </div>
        </div>
      );
    }

    if (variation.platform === 'youtube') {
      const ytCopy = copy as { headline: string; description: string };
      return (
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">
              Headline
            </p>
            <p className="text-gray-900 font-semibold text-sm">
              {ytCopy.headline}{' '}
              <span className="text-gray-400 text-xs font-normal">
                ({ytCopy.headline.length}/40)
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">
              Description
            </p>
            <p className="text-gray-700 text-sm">
              {ytCopy.description}{' '}
              <span className="text-gray-400 text-xs">
                ({ytCopy.description.length}/90)
              </span>
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-100">
        <span
          className={`w-8 h-8 ${platformColors[variation.platform]} rounded-lg flex items-center justify-center text-white font-bold text-sm`}
        >
          {platformIcons[variation.platform]}
        </span>
        <div>
          <h3 className="font-semibold text-gray-900">{variation.platformName}</h3>
          {variation.specs.imageDimensions && (
            <p className="text-xs text-gray-500">
              {variation.specs.imageDimensions}
            </p>
          )}
        </div>
      </div>

      {/* Image */}
      {variation.image && (
        <div className="relative bg-gray-100">
          <img
            src={`data:${variation.image.mimeType};base64,${variation.image.base64}`}
            alt={`${variation.platformName} ad creative`}
            className="w-full h-auto object-cover"
            style={{
              maxHeight: variation.platform === 'tiktok' ? '300px' : '200px',
            }}
          />
          <span className="absolute bottom-2 right-2 text-xs bg-black/50 text-white px-2 py-1 rounded">
            {variation.image.width}x{variation.image.height}
          </span>
        </div>
      )}

      {/* Copy */}
      <div className="p-4">{renderCopy()}</div>
    </div>
  );
}
