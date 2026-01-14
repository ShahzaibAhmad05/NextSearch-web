// components/AIOverview.tsx
'use client';

import { Spinner } from './ui';
import type { AIOverviewResponse } from '@/lib/types';

interface AIOverviewProps {
  /** The AI overview data */
  overview: AIOverviewResponse | null;
  /** Whether the overview is loading */
  loading: boolean;
  /** Error message if fetch failed */
  error: string | null;
}

/**
 * Displays an AI-generated overview of the search query.
 * Shows a loading skeleton while fetching, and gracefully handles errors.
 */
export default function AIOverview({ overview, loading, error }: AIOverviewProps) {
  // Don't render anything if there's no content and no loading state
  if (!loading && !overview && !error) {
    return null;
  }

  return (
    <div className="mb-6 animate-fade-in">
      <div className="glass-card rounded-2xl p-5 border border-white/10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h2 className="text-sm font-semibold text-white/90">AI Overview</h2>
          {loading && (
            <div className="ml-auto">
              <Spinner size="sm" />
            </div>
          )}
        </div>

        {/* Loading skeleton */}
        {loading && !overview && (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-white/10 rounded w-full" />
            <div className="h-4 bg-white/10 rounded w-11/12" />
            <div className="h-4 bg-white/10 rounded w-4/5" />
            <div className="h-4 bg-white/10 rounded w-9/12" />
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="text-sm text-red-400/80">
            Unable to generate AI overview. {error}
          </div>
        )}

        {/* Overview content */}
        {overview && (
          <div className="space-y-3">
            {/* Main overview text */}
            <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
              {overview.overview}
            </div>

            {/* Sources */}
            {overview.sources && overview.sources.length > 0 && (
              <div className="pt-2 border-t border-white/10">
                <div className="text-xs text-gray-500 mb-2">Sources</div>
                <div className="flex flex-wrap gap-2">
                  {overview.sources.map((source, idx) => (
                    <a
                      key={source.docId ?? idx}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs text-indigo-300 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <span className="truncate max-w-40">{source.title}</span>
                      {source.url && (
                        <svg
                          className="w-3 h-3 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Generation time */}
            {overview.generation_time_ms != null && (
              <div className="text-xs text-gray-500">
                Generated in {overview.generation_time_ms.toFixed(0)}ms
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
