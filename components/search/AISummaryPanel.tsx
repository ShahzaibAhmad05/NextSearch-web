// components/search/AISummaryPanel.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Ensure component is mounted (for Next.js SSR)
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle show/hide with animation
  useEffect(() => {
    if (show) {
      setIsClosing(false);
    }
  }, [show]);

  // Close with animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  // Fetch summary when panel opens
  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      const response = await getResultSummary(result.cord_uid);
      setSummary(response.summary);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setError(err instanceof Error ? err.message : 'Failed to fetch summary');
    } finally {
      setLoading(false);
    }
  }, [result.cord_uid]);

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
        handleClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [show]);

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
    <div 
      className={cn(
        "fixed inset-0 z-100 flex items-end justify-end bg-black/50 backdrop-blur-sm",
        isClosing ? "animate-fade-out" : "animate-fade-in"
      )}
      role="dialog"
      aria-modal="true"
      onClick={handleClose}
      data-lenis-prevent
    >
      {/* Side Panel */}
      <div
        className={cn(
          "h-full w-full max-w-lg glass-card border-l border-white/10 shadow-dark-lg flex flex-col overflow-hidden",
          isClosing ? "animate-fade-out-right" : "animate-fade-in-right"
        )}
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 p-5 border-b border-white/10 shrink-0">
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
            onClick={handleClose}
            aria-label="Close panel"
          >
            ✕
          </button>
        </div>

        {/* Result Info */}
        <div className="p-5 border-b border-white/10 bg-white/5 shrink-0">
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
        <div className="flex-1 overflow-y-auto p-5" data-lenis-prevent>
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
            <div className="prose prose-invert max-w-none prose-p:my-3 prose-p:leading-relaxed prose-headings:text-white/90 prose-headings:font-bold prose-headings:mt-5 prose-headings:mb-3 prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:text-indigo-300 prose-strong:text-white/95 prose-strong:font-semibold prose-em:text-gray-200 prose-code:text-indigo-300 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-lg prose-pre:p-3 prose-ul:my-3 prose-ul:list-disc prose-ul:pl-5 prose-ol:my-3 prose-ol:list-decimal prose-ol:pl-5 prose-li:my-1 prose-hr:border-white/20 prose-hr:my-4">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white/90 mt-6 mb-3" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-xl font-bold text-white/90 mt-5 mb-3" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-white/90 mt-4 mb-2" {...props} />,
                  p: ({node, ...props}) => <p className="my-3 leading-relaxed text-gray-300 text-base" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-semibold text-white/95" {...props} />,
                  em: ({node, ...props}) => <em className="text-gray-200" {...props} />,
                  ul: ({node, ...props}) => <ul className="my-3 list-disc pl-5 space-y-1" {...props} />,
                  ol: ({node, ...props}) => <ol className="my-3 list-decimal pl-5 space-y-1" {...props} />,
                  li: ({node, ...props}) => <li className="my-1" {...props} />,
                  hr: ({node, ...props}) => <hr className="border-white/20 my-4" {...props} />,
                  a: ({node, ...props}) => <a className="text-indigo-400 hover:text-indigo-300 no-underline" target="_blank" rel="noopener noreferrer" {...props} />,
                  code: ({node, className, children, ...props}) => {
                    const isInline = !className?.includes('language-');
                    return isInline 
                      ? <code className="text-indigo-300 bg-white/5 px-1.5 py-0.5 rounded text-xs" {...props}>{children}</code>
                      : <code className="block" {...props}>{children}</code>;
                  },
                  pre: ({node, ...props}) => <pre className="bg-white/5 border border-white/10 rounded-lg p-3 overflow-x-auto" {...props} />,
                }}
              >
                {summary.replace(/\\n/g, '\n')}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
