// components/search/AISummaryPanel.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { SearchResult } from '@/lib/types';
import { getResultSummary } from '@/lib/api';
import { Spinner } from '@/components/ui';
import { cn } from '@/lib/utils';

interface AISummaryPanelProps {
  /** Whether the panel is visible */
  show: boolean;
  /** Callback when panel should close */
  onClose: () => void;
  /** The search result to summarize */
  result: SearchResult;
}

/**
 * A slide-in side panel that displays an AI-generated summary for a search result.
 */
export function AISummaryPanel({ show, onClose, result }: AISummaryPanelProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Ensure component is mounted (for Next.js SSR)
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Fetch summary when panel opens
  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      const response = await getResultSummary({
        url: result.url,
        title: result.title,
        docId: result.docId,
      });
      setSummary(response.summary);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setError(err instanceof Error ? err.message : 'Failed to fetch summary');
    } finally {
      setLoading(false);
    }
  }, [result]);

  useEffect(() => {
    if (show) {
      fetchSummary();
    }
  }, [show, fetchSummary]);

  // Handle escape key
  useEffect(() => {
    if (!show) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [show, onClose]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [show]);

  if (!mounted || !show) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-100 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Side Panel */}
      <div
        className="fixed top-0 right-0 z-100 h-full w-full max-w-lg glass-card border-l border-white/10 shadow-dark-lg animate-fade-in-right"
        role="dialog"
        aria-modal="true"
        aria-label="AI Summary"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-indigo-400"
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
            <h2 className="text-lg font-semibold gradient-text">AI Summary</h2>
          </div>
          <button
            className="px-3 py-1.5 text-sm border border-white/20 text-gray-300 rounded-lg hover:bg-white/10 hover:border-indigo-500/50 hover:text-white transition-all duration-300"
            type="button"
            onClick={onClose}
            aria-label="Close panel"
          >
            ✕
          </button>
        </div>

        {/* Result Info */}
        <div className="p-5 border-b border-white/10 bg-white/5">
          <h3 className="font-medium text-white line-clamp-2 mb-1">
            {result.title || '(untitled)'}
          </h3>
          {result.url && (
            <a
              href={result.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors truncate block"
            >
              {result.url}
            </a>
          )}
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto h-[calc(100%-180px)]">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Spinner size="lg" />
              <p className="text-gray-400 text-sm">Generating AI summary...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-red-400 shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-red-300 font-medium">Failed to load summary</p>
                  <p className="text-red-400/80 text-sm mt-1">{error}</p>
                  <button
                    onClick={fetchSummary}
                    className="mt-3 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}

          {summary && !loading && !error && (
            <div className="prose prose-invert prose-sm max-w-none">
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {summary}
              </p>
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}
