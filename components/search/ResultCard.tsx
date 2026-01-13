// components/search/ResultCard.tsx
'use client';

import Image from 'next/image';
import type { SearchResult } from '@/lib/types';
import { formatByline, safeHostname, faviconUrl, cn } from '@/lib/utils';
import { ExternalLinkIcon } from './ExternalLinkIcon';

interface ResultCardProps {
  /** Search result data */
  result: SearchResult;
  /** Animation delay index for staggered animation */
  index?: number;
}

/**
 * A single search result card with favicon, title, byline, and link.
 */
export function ResultCard({ result, index = 0 }: ResultCardProps) {
  const domain = result.url ? safeHostname(result.url) : null;
  const favicon = result.url ? faviconUrl(result.url) : null;

  return (
    <div
      className={cn(
        'rounded-2xl card-hover animate-fade-in-up p-5',
        index > 0 && 'mt-0' // gap handled by parent
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start gap-4">
        {favicon && (
          <Image
            src={favicon}
            alt=""
            width={44}
            height={44}
            className="rounded-lg shrink-0 mt-0.5 ring-2 ring-white/10"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            unoptimized
          />
        )}

        <div className="grow min-w-0">
          {/* Title */}
          <div className="font-semibold text-base line-clamp-2">
            {result.url ? (
              <a
                className="clean-link"
                href={result.url}
                target="_blank"
                rel="noreferrer"
              >
                {result.title || '(untitled)'}
              </a>
            ) : (
              <span className="text-white">{result.title || '(untitled)'}</span>
            )}
          </div>

          {/* Byline */}
          <div className="text-sm text-gray-400 mt-1.5">
            {formatByline(result)}
          </div>

          {/* External link button */}
          {result.url && domain && (
            <div className="mt-4">
              <a
                href={result.url}
                target="_blank"
                rel="noreferrer"
                className="btn-view-at inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-white/20">
                <ExternalLinkIcon />
                <span>View at {domain}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
