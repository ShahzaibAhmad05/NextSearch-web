// lib/api/ai.ts

/**
 * AI-related API functions
 */

import { API_CONFIG } from '../constants';
import { ApiError } from '../types';
import type { AIOverviewResponse, ResultSummaryResponse } from '../types';
import { buildUrl, isNetworkError } from './utils';

/**
 * Get an AI-generated overview for a search query
 *
 * @param query - Search query string
 * @param signal - Optional AbortSignal for cancellation
 * @returns AI overview response with generated summary
 * @throws ApiError on failure
 */
export async function getAIOverview(
  query: string,
  signal?: AbortSignal
): Promise<AIOverviewResponse> {
  const url = buildUrl(API_CONFIG.ENDPOINTS.AI_OVERVIEW, {
    q: query,
  });

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new ApiError(
        `AI overview failed (${res.status}): ${text}`,
        res.status,
        API_CONFIG.ENDPOINTS.AI_OVERVIEW
      );
    }

    return (await res.json()) as AIOverviewResponse;
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw err;
    }
    if (isNetworkError(err)) {
      throw new ApiError(
        'Failed to connect to the backend for AI overview.',
        undefined,
        API_CONFIG.ENDPOINTS.AI_OVERVIEW
      );
    }
    throw err;
  }
}

/**
 * Get an AI-generated summary for a specific search result
 *
 * @param result - The search result object to summarize
 * @param signal - Optional AbortSignal for cancellation
 * @returns Result summary response with generated summary
 * @throws ApiError on failure
 */
export async function getResultSummary(
  result: { url?: string; title: string; docId: number },
  signal?: AbortSignal
): Promise<ResultSummaryResponse> {
  const url = buildUrl(API_CONFIG.ENDPOINTS.RESULT_SUMMARY);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(result),
      signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new ApiError(
        `Result summary failed (${res.status}): ${text}`,
        res.status,
        API_CONFIG.ENDPOINTS.RESULT_SUMMARY
      );
    }

    return (await res.json()) as ResultSummaryResponse;
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw err;
    }
    if (isNetworkError(err)) {
      throw new ApiError(
        'Failed to connect to the backend for result summary.',
        undefined,
        API_CONFIG.ENDPOINTS.RESULT_SUMMARY
      );
    }
    throw err;
  }
}
