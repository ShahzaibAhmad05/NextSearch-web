// app/(home)/components/PreSearchView.tsx
'use client';

import { useEffect, useState } from 'react';
import { SearchBar } from '@/components';
import { Footer } from '@/components';

interface PreSearchViewProps {
  query: string;
  k: number;
  loading: boolean;
  recentSearches: string[];
  onChangeQuery: (q: string) => void;
  onChangeK: (k: number) => void;
  onSubmit: () => void;
  onDeleteSuggestion?: (query: string) => void;
}

const TAGLINES = [
  'Insights across 1M+ CORD-19 research papers',
  'A powerful crawler for the CORD-19 dataset',
];

/**
 * Centered hero view shown before first search
 */
export function PreSearchView({
  query,
  k,
  loading,
  recentSearches,
  onChangeQuery,
  onChangeK,
  onSubmit,
  onDeleteSuggestion,
}: PreSearchViewProps) {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Rotate taglines
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
        setIsTransitioning(false);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-250 mx-auto px-4 sm:px-6 w-full mb-16 sm:mb-0">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-4 gradient-text animate-fade-in-down opacity-0" style={{ animationDelay: '100ms' }}>
            NextSearch
          </h1>
          <div
            className="tagline-container text-gray-400 text-sm sm:text-lg animate-fade-in-down opacity-0"
            style={{ animationDelay: '300ms' }}
          >
            <div
              className={`tagline-text ${isTransitioning ? 'exit' : 'active'}`}
            >
              {TAGLINES[taglineIndex]}
            </div>
          </div>
        </div>

        <div className="animate-slide-up-fade opacity-0 relative z-50" style={{ animationDelay: '500ms' }}>
          <SearchBar
            query={query}
            k={k}
            loading={loading}
            recentSearches={recentSearches}
            onChangeQuery={onChangeQuery}
            onChangeK={onChangeK}
            onSubmit={onSubmit}
            onDeleteSuggestion={onDeleteSuggestion}
          />
        </div>

        {/* Footer - shown in pre-search */}
        <div className="fixed bottom-0 left-0 right-0 max-w-270 mx-auto px-3 z-0">
          <Footer showScrollToTop={false} />
        </div>
      </div>
    </div>
  );
}
