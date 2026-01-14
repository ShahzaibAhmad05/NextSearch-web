// hooks/useAIOverview.ts
'use client';

import { useCallback, useRef, useState } from 'react';
import { getAIOverview } from '@/lib/api';
import type { AIOverviewResponse } from '@/lib/types';

interface UseAIOverviewReturn {
  /** The AI overview data */
  overview: AIOverviewResponse | null;
  /** Whether the AI overview is loading */
  loading: boolean;
  /** Error message if the request failed */
  error: string | null;
  /** Fetch AI overview for a query */
  fetchOverview: (query: string) => Promise<void>;
  /** Reset the AI overview state */
  reset: () => void;
}

/**
 * Hook to manage AI overview fetching.
 * Handles async loading state and cancellation of stale requests.
 */
export function useAIOverview(): UseAIOverviewReturn {
  const [overview, setOverview] = useState<AIOverviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // AbortController ref for cancelling stale requests
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchOverview = useCallback(async (query: string) => {
    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Reset state
    setOverview(null);
    setError(null);
    setLoading(true);

    try {
      const data = await getAIOverview(query, controller.signal);
      
      // Only update state if this request wasn't aborted
      if (!controller.signal.aborted) {
        setOverview(data);
        setLoading(false);
      }
    } catch (err) {
      // Ignore abort errors
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      if (!controller.signal.aborted) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
        setLoading(false);
      }
    }
  }, []);

  const reset = useCallback(() => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setOverview(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    overview,
    loading,
    error,
    fetchOverview,
    reset,
  };
}
