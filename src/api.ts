// src/api.ts

/**
 * API client for the NextSearch backend
 * Handles all HTTP requests with proper error handling and typing
 */

import { API_CONFIG } from './constants';
import type {
  SearchResponse,
  SuggestResponse,
  AddDocumentResponse,
  ApiError as ApiErrorType,
} from './types';
import { ApiError } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// Internal Utilities
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check if an error is a network-related fetch error
 */
function isNetworkError(err: unknown): boolean {
  return err instanceof TypeError && /failed to fetch/i.test(err.message);
}

/**
 * Safely parse JSON from a response, falling back to text
 */
async function parseResponseBody(res: Response): Promise<unknown> {
  const contentType = res.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return res.json();
  }

  const text = await res.text().catch(() => '');

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * Build a full URL for an API endpoint
 */
function buildUrl(endpoint: string, params?: Record<string, string>): string {
  const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`, window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  return url.toString();
}

/**
 * Format error message from API response
 */
function formatErrorMessage(
  payload: unknown,
  fallbackStatus: number
): string {
  if (typeof payload === 'string') {
    return payload;
  }

  if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>;
    if (obj.error) {
      const details = obj.details ? `: ${obj.details}` : '';
      return `${obj.error}${details}`;
    }
  }

  return `Request failed with status ${fallbackStatus}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// API Functions
// ─────────────────────────────────────────────────────────────────────────────

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

/**
 * Upload and index a CORD-19 slice zip file
 *
 * @param cordSliceZip - The zip file to upload
 * @param signal - Optional AbortSignal for cancellation
 * @returns Add document response with indexing stats
 * @throws ApiError on failure
 */
export async function addCordSlice(
  cordSliceZip: File,
  signal?: AbortSignal
): Promise<AddDocumentResponse> {
  const formData = new FormData();
  formData.append('cord_slice', cordSliceZip, cordSliceZip.name);

  const url = buildUrl(API_CONFIG.ENDPOINTS.ADD_DOCUMENT);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData,
      signal,
    });

    if (!res.ok) {
      const payload = await parseResponseBody(res);
      const message = formatErrorMessage(payload, res.status);
      throw new ApiError(
        `Add document failed (${res.status}): ${message}`,
        res.status,
        API_CONFIG.ENDPOINTS.ADD_DOCUMENT
      );
    }

    return (await res.json()) as AddDocumentResponse;
  } catch (err) {
    if (isNetworkError(err)) {
      throw new ApiError(
        'Failed to connect to the backend. ' +
          'Please ensure the server is running on 127.0.0.1:8080 and /health endpoint is accessible.',
        undefined,
        API_CONFIG.ENDPOINTS.ADD_DOCUMENT
      );
    }
    throw err;
  }
}
