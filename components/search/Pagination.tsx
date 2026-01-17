// components/search/Pagination.tsx
'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  /** Current page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Maximum number of page buttons to show */
  maxButtons?: number;
}

/**
 * A pagination component with first/last and prev/next navigation.
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxButtons = 10,
}: PaginationProps) {
  // Calculate which page numbers to show - fewer on mobile
  const pageItems = useMemo(() => {
    // Reduce to 5 buttons on mobile, 10 on desktop
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const effectiveMaxButtons = isMobile ? 5 : maxButtons;
    
    if (totalPages <= effectiveMaxButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Show pages around current page
    const half = Math.floor(effectiveMaxButtons / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + effectiveMaxButtons - 1);

    // Adjust start if we're near the end
    if (end - start < effectiveMaxButtons - 1) {
      start = Math.max(1, end - effectiveMaxButtons + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [totalPages, currentPage, maxButtons]);

  if (totalPages <= 1) return null;

  const goTo = (page: number) => {
    const safePage = Math.min(Math.max(1, page), totalPages);
    onPageChange(safePage);
  };

  const buttonBase =
    'px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300';
  const buttonDisabled = 'text-gray-600 cursor-not-allowed';
  const buttonEnabled = 'text-gray-300 hover:bg-gradient-to-r hover:from-green-500/10 hover:to-green-500/20';
  const buttonActive =
    'bg-gradient-to-r from-green-500/30 to-green-500/50 text-white';

  return (
    <div className="mt-8 animate-fade-in">
      <div className="flex flex-col items-center gap-3">
        <nav aria-label="Search results pages" className="w-full overflow-x-auto">
          <ul className="flex justify-center gap-2 min-w-max px-2">
            {/* First */}
            <li>
              <button
                className={cn(
                  buttonBase,
                  currentPage === 1 ? buttonDisabled : buttonEnabled
                )}
                type="button"
                onClick={() => goTo(1)}
                disabled={currentPage === 1}
                aria-label="Go to first page"
              >
                «
              </button>
            </li>

            {/* Previous */}
            <li>
              <button
                className={cn(
                  buttonBase,
                  currentPage === 1 ? buttonDisabled : buttonEnabled
                )}
                type="button"
                onClick={() => goTo(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Go to previous page"
              >
                ‹
              </button>
            </li>

            {/* Page numbers */}
            {pageItems.map((page) => (
              <li key={`page-${page}`}>
                <button
                  className={cn(
                    'min-w-7 sm:min-w-10',
                    buttonBase,
                    page === currentPage ? buttonActive : buttonEnabled
                  )}
                  type="button"
                  onClick={() => goTo(page)}
                  aria-label={`Go to page ${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </button>
              </li>
            ))}

            {/* Next */}
            <li>
              <button
                className={cn(
                  buttonBase,
                  currentPage === totalPages ? buttonDisabled : buttonEnabled
                )}
                type="button"
                onClick={() => goTo(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Go to next page"
              >
                ›
              </button>
            </li>

            {/* Last */}
            <li>
              <button
                className={cn(
                  buttonBase,
                  currentPage === totalPages ? buttonDisabled : buttonEnabled
                )}
                type="button"
                onClick={() => goTo(totalPages)}
                disabled={currentPage === totalPages}
                aria-label="Go to last page"
              >
                »
              </button>
            </li>
          </ul>
        </nav>

        <div className="text-xs sm:text-sm text-gray-400">
          Page{' '}
          <span className="font-semibold bg-linear-to-r text-green-600 bg-clip-text">{currentPage}</span>{' '}
          of{' '}
          <span className="font-semibold bg-linear-to-r text-green-600 bg-clip-text">{totalPages}</span>
        </div>
      </div>
    </div>
  );
}
