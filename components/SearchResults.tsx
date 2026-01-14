// components/SearchResults.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ResultCard, Pagination } from './search';
import { SEARCH_CONFIG } from '@/lib/constants';
import { useVisitedLinks } from '@/hooks';
import type { SearchResultsProps } from '@/lib/types';

/**
 * Paginated search results display.
 * Shows result cards with staggered animations and pagination controls.
 */
export default function SearchResults({
  results,
  pageSize = SEARCH_CONFIG.DEFAULT_PAGE_SIZE,
}: SearchResultsProps) {
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);
  const { isVisited, markVisited } = useVisitedLinks();

  const totalPages = Math.max(1, Math.ceil(results.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  // Scroll to top of results when page changes
  useEffect(() => {
    if (safePage === 1) return; // Skip scroll on initial load
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [safePage]);

  // Reset to page 1 when results change
  useEffect(() => {
    setPage(1);
  }, [results]);

  // Get results for current page
  const pageResults = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return results.slice(start, start + pageSize);
  }, [results, safePage, pageSize]);

  // Handle page changes
  const handlePageChange = (newPage: number) => {
    setPage(Math.min(Math.max(1, newPage), totalPages));
  };

  if (!results.length) {
    return (
      <div className="mt-3 text-gray-400">
        No results.
      </div>
    );
  }

  return (
    <div className="mt-3">
      {/* Scroll anchor */}
      <div ref={topRef} />

      {/* Results grid */}
      <div className="grid">
        {pageResults.map((result, idx) => (
          <ResultCard
            key={result.docId}
            result={result}
            index={idx}
            isVisited={result.url ? isVisited(result.url) : false}
            onVisit={markVisited}
          />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <br />
    </div>
  );
}
