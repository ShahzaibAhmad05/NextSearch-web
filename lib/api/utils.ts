// lib/api/utils.ts

/**
 * Internal API utilities
 */

import { API_CONFIG } from '../constants';
import { ApiError } from '../types';

/**
 * Check if an error is a network-related fetch error
 */
export function isNetworkError(err: unknown): boolean {
  return err instanceof TypeError && /failed to fetch/i.test(err.message);
}

/**
 * Safely parse JSON from a response, falling back to text
 */
export async function parseResponseBody(res: Response): Promise<unknown> {
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
export function buildUrl(endpoint: string, params?: Record<string, string>): string {
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`, base || 'http://localhost:3000');

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
export function formatErrorMessage(
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
