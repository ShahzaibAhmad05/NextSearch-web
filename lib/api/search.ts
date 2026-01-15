// lib/api/search.ts

/**
 * Search-related API functions
 */

import { API_CONFIG } from '../constants';
import { ApiError } from '../types';
import type { SearchResponse, SuggestResponse } from '../types';
import { buildUrl } from './utils';

/**
 * Search for documents matching a query
 *
 * @param query - Search query string
 * @param k - Maximum number of results to return
 * @returns Search response with results
 * @throws ApiError on failure
 */
export async function search(
  query: string,
  k: number
): Promise<SearchResponse> {
  const url = buildUrl(API_CONFIG.ENDPOINTS.SEARCH, {
    q: query,
    k: String(k),
  });

  const res = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new ApiError(
      `Search failed (${res.status}): ${text}`,
      res.status,
      API_CONFIG.ENDPOINTS.SEARCH
    );
  }

  return (await res.json()) as SearchResponse;
}

/**
 * Get autocomplete suggestions for a query prefix
 *
 * @param query - Query prefix to get suggestions for
 * @param k - Maximum number of suggestions to return
 * @param signal - Optional AbortSignal for cancellation
 * @returns Suggest response with suggestions array
 * @throws ApiError on failure
 */
export async function suggest(
  query: string,
  k: number,
  signal?: AbortSignal
): Promise<SuggestResponse> {
  const url = buildUrl(API_CONFIG.ENDPOINTS.SUGGEST, {
    q: query,
    k: String(k),
  });

  const res = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new ApiError(
      `Suggest failed (${res.status}): ${text}`,
      res.status,
      API_CONFIG.ENDPOINTS.SUGGEST
    );
  }

  return (await res.json()) as SuggestResponse;
}
