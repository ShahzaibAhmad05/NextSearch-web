// hooks/useAIOverview.ts
'use client';

import { useCallback, useRef, useState } from 'react';
import { getAIOverview } from '@/lib/api';
import type { AIOverviewResponse } from '@/lib/types';
import { useAIRateLimit } from './useAIRateLimit';

interface UseAIOverviewReturn {
  /** The AI overview data */
  overview: AIOverviewResponse | null;
  /** Whether the AI overview is loading */
  loading: boolean;
  /** Error message if the request failed */
  error: string | null;
  /** Fetch AI overview for a query */
  fetchOverview: (query: string) => Promise<void>;
  /** Set AI overview data directly (without fetching) */
  setOverview: (data: AIOverviewResponse | null) => void;
  /** Reset the AI overview state */
  reset: () => void;
  /** Whether rate limit has been exceeded */
  isRateLimited: boolean;
  /** Number of remaining requests */
  remainingRequests: number;
}

/**
 * Hook to manage AI overview fetching.
 * Handles async loading state and cancellation of stale requests.
 * Includes rate limiting for unauthorized users.
 */
export function useAIOverview(): UseAIOverviewReturn {
  const [overview, setOverview] = useState<AIOverviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Rate limiting
  const { isLimitExceeded, incrementCount, remainingRequests } = useAIRateLimit();

  // AbortController ref for cancelling stale requests
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchOverview = useCallback(async (query: string) => {
    // Check rate limit before making request
    if (isLimitExceeded) {
      setError('You have reached the maximum number of AI requests. Please try again later.');
      setLoading(false);
      return;
    }

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
        // Only increment rate limit counter if response was not cached
        if (!data.cached) {
          incrementCount();
        }
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
  }, [isLimitExceeded, incrementCount]);

  const setOverviewData = useCallback((data: AIOverviewResponse | null) => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setOverview(data);
    setLoading(false);
    setError(null);
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
    setOverview: setOverviewData,
    reset,
    isRateLimited: isLimitExceeded,
    remainingRequests,
  };
}
