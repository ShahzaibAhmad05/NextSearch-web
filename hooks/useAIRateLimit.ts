// hooks/useAIRateLimit.ts
'use client';

import { useState, useEffect, useCallback } from 'react';

const AI_RATE_LIMIT_KEY = 'ai_request_count';
const AI_RATE_LIMIT_TIMESTAMP_KEY = 'ai_request_timestamp';
const AI_RATE_LIMIT_MAX = 10;
const AI_RATE_LIMIT_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

interface UseAIRateLimitReturn {
  /** Current number of AI requests made */
  requestCount: number;
  /** Whether the rate limit has been exceeded */
  isLimitExceeded: boolean;
  /** Increment the request count */
  incrementCount: () => void;
  /** Reset the request count */
  resetCount: () => void;
  /** Remaining requests available */
  remainingRequests: number;
}

/**
 * Hook to manage AI API request rate limiting using localStorage.
 * Tracks the number of AI requests made and enforces a limit of 10 requests.
 */
export function useAIRateLimit(): UseAIRateLimitReturn {
  const [requestCount, setRequestCount] = useState(0);

  // Load count from localStorage on mount and check expiry
  useEffect(() => {
    const stored = localStorage.getItem(AI_RATE_LIMIT_KEY);
    const timestamp = localStorage.getItem(AI_RATE_LIMIT_TIMESTAMP_KEY);
    
    if (stored && timestamp) {
      const timestampNum = parseInt(timestamp, 10);
      const now = Date.now();
      
      // Check if the data has expired (24 hours)
      if (now - timestampNum > AI_RATE_LIMIT_EXPIRY_MS) {
        // Expired, reset the count
        localStorage.setItem(AI_RATE_LIMIT_KEY, '0');
        localStorage.setItem(AI_RATE_LIMIT_TIMESTAMP_KEY, String(now));
        setRequestCount(0);
      } else {
        // Not expired, use stored count
        const count = parseInt(stored, 10);
        if (!isNaN(count)) {
          setRequestCount(count);
        }
      }
    } else if (stored) {
      // Has count but no timestamp, set timestamp to now
      const count = parseInt(stored, 10);
      if (!isNaN(count)) {
        setRequestCount(count);
        localStorage.setItem(AI_RATE_LIMIT_TIMESTAMP_KEY, String(Date.now()));
      }
    }
  }, []);

  // Increment count and save to localStorage with timestamp
  const incrementCount = useCallback(() => {
    setRequestCount((prev) => {
      const newCount = prev + 1;
      const now = Date.now();
      localStorage.setItem(AI_RATE_LIMIT_KEY, String(newCount));
      localStorage.setItem(AI_RATE_LIMIT_TIMESTAMP_KEY, String(now));
      return newCount;
    });
  }, []);

  // Reset count
  const resetCount = useCallback(() => {
    setRequestCount(0);
    const now = Date.now();
    localStorage.setItem(AI_RATE_LIMIT_KEY, '0');
    localStorage.setItem(AI_RATE_LIMIT_TIMESTAMP_KEY, String(now));
  }, []);

  const isLimitExceeded = requestCount >= AI_RATE_LIMIT_MAX;
  const remainingRequests = Math.max(0, AI_RATE_LIMIT_MAX - requestCount);

  return {
    requestCount,
    isLimitExceeded,
    incrementCount,
    resetCount,
    remainingRequests,
  };
}
