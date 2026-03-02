// lib/services/stats.ts

/**
 * Statistics service functions
 */

import { API_CONFIG } from '../constants';
import { ApiError } from '../types';
import type { StatsResponse } from '../types/stats';
import { buildUrl, isNetworkError } from './utils';

// Re-export types
export type { StatsResponse };

/**
 * Fetch statistics from the backend (publicly accessible)
 *
 * @param signal - Optional AbortSignal for cancellation
 * @returns Statistics response with system metrics
 * @throws ApiError on failure
 */
export async function getStats(signal?: AbortSignal): Promise<StatsResponse> {
  const url = buildUrl(API_CONFIG.ENDPOINTS.STATS);

  const headers: HeadersInit = {
    Accept: 'application/json',
  };

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers,
      signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new ApiError(
        `Stats request failed (${res.status}): ${text}`,
        res.status,
        API_CONFIG.ENDPOINTS.STATS
      );
    }

    return (await res.json()) as StatsResponse;
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw err;
    }
    if (isNetworkError(err)) {
      throw new ApiError(
        'Failed to connect to the backend for statistics.',
        undefined,
        API_CONFIG.ENDPOINTS.STATS
      );
    }
    throw err;
  }
}
