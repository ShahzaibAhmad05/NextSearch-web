// hooks/usePagination.ts
'use client';

import { useState, useEffect, useMemo } from 'react';

interface UsePaginationOptions {
  totalItems: number;
  pageSize: number;
  resetDeps?: any[];
}

interface UsePaginationReturn {
  page: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  setPage: (page: number) => void;
  goToPage: (page: number) => void;
}

/**
 * Hook for managing pagination state
 */
export function usePagination({
  totalItems,
  pageSize,
  resetDeps = [],
}: UsePaginationOptions): UsePaginationReturn {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const startIndex = (safePage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Reset to page 1 when dependencies change
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, resetDeps);

  const goToPage = (newPage: number) => {
    setPage(Math.min(Math.max(1, newPage), totalPages));
  };

  return {
    page: safePage,
    totalPages,
    startIndex,
    endIndex,
    setPage,
    goToPage,
  };
}
