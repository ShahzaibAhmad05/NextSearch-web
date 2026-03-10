// components/SearchResults.tsx
'use client';

import { useEffect, useMemo } from 'react';
import { ResultCard, Pagination } from './search';
import { SEARCH_CONFIG } from '@/lib/constants';
import { isResultTitleEnglish } from '@/lib/utils';
import { usePagination } from '@/hooks';
import type { SearchResultsProps } from '@/lib/types';

function scrollToTop() {
  if (typeof window === 'undefined') return;
  
  if ((window as any).lenis) {
    (window as any).lenis.scrollTo(0, { duration: 0.8, immediate: false });
  } else {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
}

export default function SearchResults({
  results,
  pageSize = SEARCH_CONFIG.DEFAULT_PAGE_SIZE,
  showNonEnglish = false,
  isVisited,
  markVisited,
}: SearchResultsProps) {
  // Filter results based on language preference
  const filteredResults = useMemo(() => {
    return showNonEnglish 
      ? results 
      : results.filter(result => isResultTitleEnglish(result.title));
  }, [results, showNonEnglish]);

  // Pagination logic
  const { page, totalPages, startIndex, endIndex, goToPage } = usePagination({
    totalItems: filteredResults.length,
    pageSize,
    resetDeps: [results, showNonEnglish],
  });

  // Get results for current page
  const pageResults = useMemo(() => {
    return filteredResults.slice(startIndex, endIndex);
  }, [filteredResults, startIndex, endIndex]);

  // Scroll to top when page changes
  useEffect(() => {
    scrollToTop();
  }, [page]);

  // Empty state
  if (!filteredResults.length) {
    const hiddenCount = results.length - filteredResults.length;
    return (
      <div className="mt-3 text-gray-400">
        {hiddenCount > 0 ? (
          <>
            No English results. {hiddenCount} non-English result{hiddenCount === 1 ? '' : 's'} hidden.
          </>
        ) : (
          'No results.'
        )}
      </div>
    );
  }

  return (
    <div className="mt-3">
      <div className="grid">
        {pageResults.map((result, idx) => (
          <ResultCard
            key={result.docId}
            result={result}
            index={idx}
            isVisited={result.url && isVisited ? isVisited(result.url) : false}
            onVisit={markVisited}
          />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={goToPage}
      />

      <br />
    </div>
  );
}
      />

      <br />
    </div>
  );
}
