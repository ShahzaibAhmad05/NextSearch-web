// lib/services/stats.ts

/**
 * Statistics service functions
 */

import { API_CONFIG } from '../constants';
import { ApiError } from '../types';
import type { StatsResponse } from '../types/stats';
import { buildUrl, isNetworkError } from './utils';
import { getAdminToken } from './admin';

/**
 * Fetch statistics from the backend (requires admin authentication)
 *
 * @param signal - Optional AbortSignal for cancellation
 * @returns Statistics response with system metrics
 * @throws ApiError on failure or if not authenticated
 */
export async function getStats(signal?: AbortSignal): Promise<StatsResponse> {
  const url = buildUrl(API_CONFIG.ENDPOINTS.STATS);

  // Get admin token - required for stats endpoint
  const token = getAdminToken();
  if (!token) {
    throw new ApiError(
      'Admin authentication required to access statistics',
      401,
      API_CONFIG.ENDPOINTS.STATS
    );
  }

  const headers: HeadersInit = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  };

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers,
      signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      if (res.status === 401 || res.status === 403) {
        throw new ApiError(
          'Unauthorized: Invalid or expired admin token',
          res.status,
          API_CONFIG.ENDPOINTS.STATS
        );
      }
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
