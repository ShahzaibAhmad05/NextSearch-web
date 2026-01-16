// components/AIOverview.tsx
'use client';

import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Spinner } from './ui';
import type { AIOverviewResponse } from '@/lib/types';

interface AIOverviewProps {
  /** The AI overview data */
  overview: AIOverviewResponse | null;
  /** Whether the overview is loading */
  loading: boolean;
  /** Error message if fetch failed */
  error: string | null;
  /** Optional ref to scroll to when expanding (e.g., hr element above) */
  hrRef?: React.RefObject<HTMLHRElement>;
}

/**
 * Displays an AI-generated overview of the search query.
 * Shows a loading skeleton while fetching, and gracefully handles errors.
 */
export default function AIOverview({ overview, loading, error, hrRef }: AIOverviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Don't render anything if there's no content and no loading state
  if (!loading && !overview && !error) {
    return null;
  }

  const handleToggleExpand = () => {
    if (isExpanded) {
      // Scroll to top when collapsing
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
    else {
      // Scroll just above the hr element
      window.scrollTo({ top: 75, behavior: 'smooth' });
    }
    setIsExpanded(!isExpanded);
  };

  // Smart truncation: find the best position to truncate at a horizontal rule
  const MAX_PREVIEW_LENGTH = 500;
  const shouldTruncate = overview && overview.overview && overview.overview.length > MAX_PREVIEW_LENGTH;
  
  const getSmartTruncatePosition = (content: string, maxLength: number): number => {
    // Find all positions of horizontal rules (---)
    const hrPattern = /^---+$/gm;
    const matches = [];
    let match;
    
    while ((match = hrPattern.exec(content)) !== null) {
      matches.push(match.index);
    }
    
    if (matches.length === 0) {
      // No horizontal rules found, use max length
      return maxLength;
    }
    
    // Find the last horizontal rule that is before maxLength
    for (let i = matches.length - 1; i >= 0; i--) {
      if (matches[i] < maxLength) {
        return matches[i];
      }
    }
    
    // All horizontal rules are after maxLength, use the first one if it's reasonable
    if (matches[0] < maxLength * 1.5) {
      return matches[0];
    }
    
    // Otherwise use max length
    return maxLength;
  };
  
  const displayContent = overview && overview.overview 
    ? (shouldTruncate && !isExpanded 
        ? overview.overview.substring(0, getSmartTruncatePosition(overview.overview, MAX_PREVIEW_LENGTH))
        : overview.overview)
    : '';

  return (
    <div ref={containerRef} className="mb-6 animate-fade-in flex justify-left max-w-3xl w-full">
      <div className="glass-card rounded-2xl p-5 border border-white/10 w-full">
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
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
          <h2 className="text-sm font-semibold text-white/90">AI Overview</h2>
          <div className="ml-auto flex items-center gap-2">
            {loading && <Spinner size="sm" />}
          </div>
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
        {overview && overview.overview && (
          <div className="space-y-3">
            {/* Main overview text with markdown rendering */}
            <div className="text-gray-300 leading-relaxed prose prose-invert max-w-none prose-p:my-3 prose-p:leading-relaxed prose-headings:text-white/90 prose-headings:font-bold prose-headings:mt-5 prose-headings:mb-3 prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:text-indigo-300 prose-strong:text-white/95 prose-strong:font-semibold prose-em:text-gray-200 prose-code:text-indigo-300 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-lg prose-pre:p-3 prose-ul:my-3 prose-ul:list-disc prose-ul:pl-5 prose-ol:my-3 prose-ol:list-decimal prose-ol:pl-5 prose-li:my-1 prose-hr:border-white/20 prose-hr:my-4">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white/90 mt-6 mb-3" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-xl font-bold text-white/90 mt-5 mb-3" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-white/90 mt-4 mb-2" {...props} />,
                  p: ({node, ...props}) => <p className="my-3 leading-relaxed text-base" {...props} />,
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
                {displayContent.replace(/\\n/g, '\n')}
              </ReactMarkdown>
            </div>

            {/* Show More/Less Button */}
            {shouldTruncate && (
              <div className="flex justify-center">
                <button
                  onClick={handleToggleExpand}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors group"
                >
                  <span>{isExpanded ? 'Show less' : 'Show more'}</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'animate-bounce'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Model info */}
            {overview.model && (
              <div className="pt-2 border-t border-white/10 flex flex-wrap gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <span>Model:</span>
                  <span className="text-gray-400">{overview.model}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
