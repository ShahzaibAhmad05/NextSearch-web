// lib/services/ai.ts

/**
 * AI-related service functions
 */

import { API_CONFIG } from '../constants';
import { ApiError } from '../types';
import type { AIOverviewResponse, ResultSummaryResponse } from '../types';
import { buildUrl, isNetworkError } from './utils';
import { getAdminToken } from './admin';

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

  // Get admin token if available
  const token = getAdminToken();
  const headers: HeadersInit = { Accept: 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers,
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
 * @param cordUid - The CORD-19 unique identifier for the result
 * @param signal - Optional AbortSignal for cancellation
 * @returns Result summary response with generated summary
 * @throws ApiError on failure
 */
export async function getResultSummary(
  cordUid: string,
  signal?: AbortSignal
): Promise<ResultSummaryResponse> {
  const url = buildUrl(API_CONFIG.ENDPOINTS.AI_SUMMARY, {
    cord_uid: cordUid,
  });

  // Get admin token if available
  const token = getAdminToken();
  const headers: HeadersInit = { Accept: 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers,
      signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      
      // Try to parse the error as JSON to check for specific error messages
      let errorMessage = `AI summary failed (${res.status}): ${text}`;
      
      try {
        const errorData = JSON.parse(text);
        if (errorData.error && errorData.error.includes('No abstract available')) {
          errorMessage = 'NO_ABSTRACT_AVAILABLE';
        }
      } catch (parseError) {
        // If parsing fails, use the original error message
      }
      
      throw new ApiError(
        errorMessage,
        res.status,
        API_CONFIG.ENDPOINTS.AI_SUMMARY
      );
    }

    return (await res.json()) as ResultSummaryResponse;
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw err;
    }
    if (isNetworkError(err)) {
      throw new ApiError(
        'Failed to connect to the backend for AI summary.',
        undefined,
        API_CONFIG.ENDPOINTS.AI_SUMMARY
      );
    }
    throw err;
  }
}
