// hooks/useRecentSearches.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { RecentSearch } from '@/lib/types';

const STORAGE_KEY = 'nextsearch-recent-searches';
const MAX_RECENT_SEARCHES = 10;

interface UseRecentSearchesReturn {
  /** List of recent searches */
  recentSearches: RecentSearch[];
  /** Add a new search to history */
  addSearch: (query: string, resultCount?: number) => void;
  /** Remove a specific search from history */
  removeSearch: (query: string) => void;
  /** Clear all search history */
  clearHistory: () => void;
}

/**
 * A hook that manages recent search history in localStorage.
 * Automatically persists and retrieves search history.
 */
export function useRecentSearches(): UseRecentSearchesReturn {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed);
        }
      }
    } catch {
      // Invalid data, ignore
    }
  }, []);

  // Save to localStorage whenever history changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSearches));
    } catch {
      // localStorage might be full or disabled
    }
  }, [recentSearches]);

  const addSearch = useCallback((query: string, resultCount?: number) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setRecentSearches((prev) => {
      // Remove existing entry with same query (to move it to top)
      const filtered = prev.filter((s) => s.query.toLowerCase() !== trimmed.toLowerCase());
      
      // Add new entry at the beginning
      const updated: RecentSearch[] = [
        { query: trimmed, timestamp: Date.now(), resultCount },
        ...filtered,
      ].slice(0, MAX_RECENT_SEARCHES);

      return updated;
    });
  }, []);

  const removeSearch = useCallback((query: string) => {
    setRecentSearches((prev) =>
      prev.filter((s) => s.query.toLowerCase() !== query.toLowerCase())
    );
  }, []);

  const clearHistory = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore errors
    }
  }, []);

  return {
    recentSearches,
    addSearch,
    removeSearch,
    clearHistory,
  };
}
