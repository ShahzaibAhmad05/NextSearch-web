// components/search/ResultCard.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { SearchResult } from '@/lib/types';
import { formatByline, safeHostname, faviconUrl, cn } from '@/lib/utils';
import { ExternalLinkIcon } from './ExternalLinkIcon';
import { AISummaryPanel } from './AISummaryPanel';

interface ResultCardProps {
  /** Search result data */
  result: SearchResult;
  /** Animation delay index for staggered animation */
  index?: number;
  /** Whether this result has been visited before */
  isVisited?: boolean;
  /** Callback when the result link is clicked */
  onVisit?: (url: string, title: string) => void;
}

/**
 * A single search result card with favicon, title, byline, and link.
 */
export function ResultCard({ result, index = 0, isVisited = false, onVisit }: ResultCardProps) {
  const [showSummaryPanel, setShowSummaryPanel] = useState(false);
  const domain = result.url ? safeHostname(result.url) : null;
  const favicon = result.url ? faviconUrl(result.url) : null;

  const handleLinkClick = () => {
    if (result.url && onVisit) {
      onVisit(result.url, result.title || '(untitled)');
    }
  };

  return (
    <div
      className={cn(
        'rounded-2xl card-hover animate-fade-in-up p-3 sm:p-5',
        index > 0 && 'mt-0' // gap handled by parent
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {favicon && (
          <Image
            src={favicon}
            alt=""
            width={36}
            height={36}
            className="rounded-lg shrink-0 mt-0.5 ring-2 ring-white/10 sm:w-11 sm:h-11"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            unoptimized
          />
        )}

        <div className="grow min-w-0">
          {/* Title */}
          <div className="font-semibold text-sm sm:text-base line-clamp-2">
            {result.url ? (
              <a
                className="clean-link"
                href={result.url}
                target="_blank"
                rel="noreferrer"
                onClick={handleLinkClick}
              >
                {result.title || '(untitled)'}
              </a>
            ) : (
              <span className="text-white">{result.title || '(untitled)'}</span>
            )}
          </div>

          {/* Recently viewed tag */}
          {isVisited && (
            <div className="mt-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-linear-to-r from-violet-500/20 to-fuchsia-500/20 text-violet-300 border border-violet-400/40 shadow-sm shadow-violet-500/20">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Recently viewed
              </span>
            </div>
          )}

          {/* Byline */}
          <div className="text-sm text-gray-400 mt-1.5">
            {formatByline(result)}
          </div>

          {/* External link button */}
          {result.url && domain && (
            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <a
                href={result.url}
                target="_blank"
                rel="noreferrer"
                onClick={handleLinkClick}
                className="btn-view-at inline-flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm rounded-lg border border-teal-500/30 text-gray-300 hover:bg-teal-500/10 hover:border-teal-400/50 hover:text-white transition-all duration-300">
                <ExternalLinkIcon />
                <span>View at {domain}</span>
              </a>
              <button
                type="button"
                onClick={() => setShowSummaryPanel(true)}
                className="inline-flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm rounded-lg border border-white/20 text-gray-300 hover:bg-white/10 hover:border-indigo-500/50 hover:text-white transition-all duration-300"
                aria-label="Get AI summary"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <span>AI Summary</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* AI Summary Panel */}
      <AISummaryPanel
        show={showSummaryPanel}
        onClose={() => setShowSummaryPanel(false)}
        result={result}
      />
    </div>
  );
}
