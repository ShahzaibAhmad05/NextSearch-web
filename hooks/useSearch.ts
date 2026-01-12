// hooks/useSearch.ts
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { search as apiSearch } from '@/lib/api';
import { SEARCH_CONFIG } from '@/lib/constants';
import { publishTimeToMs } from '@/lib/utils';
import type { SearchResult } from '@/lib/types';
import type { SortOption } from '@/lib/constants';

interface UseSearchOptions {
  /** Initial query string */
  initialQuery?: string;
  /** Initial number of results to fetch */
  initialK?: number;
}

interface UseSearchReturn {
  // State
  query: string;
  k: number;
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  found: number | undefined;
  backendTotalMs: number | null;
  hasSearched: boolean;
  sortBy: SortOption;

  // Derived
  sortedResults: SearchResult[];
  status: string;

  // Actions
  setQuery: (query: string) => void;
  setK: (k: number) => void;
  setSortBy: (sort: SortOption) => void;
  submit: () => Promise<void>;
  reset: () => void;
}

/**
 * Clamp k value to valid range
 */
function clampK(v: number): number {
  if (Number.isNaN(v)) return SEARCH_CONFIG.DEFAULT_K;
  return Math.min(
    SEARCH_CONFIG.MAX_K,
    Math.max(SEARCH_CONFIG.MIN_K, Math.trunc(v))
  );
}

/**
 * A hook that manages the complete search state and logic.
 * Handles querying, pagination parameters, sorting, and auto-refresh on k change.
 */
export function useSearch({
  initialQuery = '',
  initialK = SEARCH_CONFIG.DEFAULT_K,
}: UseSearchOptions = {}): UseSearchReturn {
  // Core state
  const [query, setQuery] = useState(initialQuery);
  const [k, setKRaw] = useState(clampK(initialK));
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [found, setFound] = useState<number | undefined>();
  const [backendTotalMs, setBackendTotalMs] = useState<number | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('Relevancy');

  const prevKRef = useRef(k);

  // Wrap setK with clamping
  const setK = useCallback((value: number) => {
    setKRaw(clampK(value));
  }, []);

  // Submit search
  const submit = useCallback(async () => {
    if (!query.trim()) return;

    setError(null);
    setLoading(true);

    try {
      const data = await apiSearch(query, k);
      setResults(data.results);
      setFound(data.found);
      setHasSearched(true);
      setBackendTotalMs(data.total_time_ms ?? null);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      setError(message);
      setResults([]);
      setHasSearched(true);
      setBackendTotalMs(null);
    } finally {
      setLoading(false);
    }
  }, [query, k]);

  // Auto-refresh on k change (debounced)
  useEffect(() => {
    if (!hasSearched) {
      prevKRef.current = k;
      return;
    }
    if (prevKRef.current === k) return;

    prevKRef.current = k;
    if (!query.trim()) return;

    const timer = window.setTimeout(() => {
      if (!loading) {
        submit();
      }
    }, SEARCH_CONFIG.K_CHANGE_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [k, hasSearched, query, loading, submit]);

  // Sorted results
  const sortedResults = useMemo(() => {
    const copy = [...results];

    if (sortBy !== 'Relevancy') {
      copy.sort((a, b) => {
        const ta = publishTimeToMs(a.publish_time);
        const tb = publishTimeToMs(b.publish_time);

        const aBad = Number.isNaN(ta);
        const bBad = Number.isNaN(tb);
        if (aBad && bBad) return 0;
        if (aBad) return 1;
        if (bBad) return -1;

        return sortBy === 'Publish Date (Newest)' ? tb - ta : ta - tb;
      });
    }

    return copy;
  }, [results, sortBy]);

  // Status message
  const status = useMemo(() => {
    if (!hasSearched) return '';
    if (loading) return 'Searching…';
    if (error) return 'Error fetching results';
    if (results.length === 0) return 'No results found';

    const n = found ?? results.length;
    const parts: string[] = [`About ${n} result${n === 1 ? '' : 's'}`];

    if (backendTotalMs != null) parts.push(`(${backendTotalMs.toFixed(2)} ms)`);
    return parts.join(' ');
  }, [hasSearched, loading, error, results.length, backendTotalMs, found]);

  // Reset all state
  const reset = useCallback(() => {
    setQuery('');
    setKRaw(SEARCH_CONFIG.DEFAULT_K);
    setResults([]);
    setError(null);
    setFound(undefined);
    setBackendTotalMs(null);
    setHasSearched(false);
    setSortBy('Relevancy');
  }, []);

  return {
    // State
    query,
    k,
    results,
    loading,
    error,
    found,
    backendTotalMs,
    hasSearched,
    sortBy,

    // Derived
    sortedResults,
    status,

    // Actions
    setQuery,
    setK,
    setSortBy,
    submit,
    reset,
  };
}
