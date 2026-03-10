// hooks/useSearchState.ts
'use client';

import { useState, useCallback, useMemo } from 'react';
import { search as apiSearch } from '@/lib/api';
import { SEARCH_CONFIG } from '@/lib/constants';
import type { SearchResult } from '@/lib/types';

interface UseSearchStateOptions {
  onSearchComplete?: (query: string, resultCount: number) => void;
}

interface UseSearchStateReturn {
  query: string;
  k: number;
  loading: boolean;
  results: SearchResult[];
  error: string | null;
  found: number | undefined;
  backendTotalMs: number | null;
  cached: boolean;
  hasSearched: boolean;
  setQuery: (query: string) => void;
  setK: (k: number) => void;
  search: (queryOverride?: string, shouldFetchAI?: boolean) => Promise<void>;
}

export function useSearchState({ onSearchComplete }: UseSearchStateOptions = {}): UseSearchStateReturn {
  const [query, setQuery] = useState('');
  const [k, setK] = useState<number>(SEARCH_CONFIG.DEFAULT_K);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [found, setFound] = useState<number | undefined>();
  const [backendTotalMs, setBackendTotalMs] = useState<number | null>(null);
  const [cached, setCached] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState(false);

  const search = useCallback(
    async (queryOverride?: string, shouldFetchAI: boolean = true) => {
      const searchQuery = (queryOverride ?? query).trim();
      if (!searchQuery) return;

      setError(null);
      setLoading(true);

      try {
        const data = await apiSearch(searchQuery, k);
        setResults(data.results);
        setFound(data.found);
        setHasSearched(true);
        setBackendTotalMs(data.total_time_ms ?? null);
        setCached(data.cached ?? false);

        onSearchComplete?.(searchQuery, data.found ?? data.results.length);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
        setResults([]);
        setHasSearched(true);
        setBackendTotalMs(null);
        setCached(false);
      } finally {
        setLoading(false);
      }
    },
    [query, k, onSearchComplete]
  );

  return {
    query,
    k,
    loading,
    results,
    error,
    found,
    backendTotalMs,
    cached,
    hasSearched,
    setQuery,
    setK,
    search,
  };
}
