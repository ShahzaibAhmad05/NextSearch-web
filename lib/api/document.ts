// lib/api/document.ts

/**
 * Document management API functions
 */

import { API_CONFIG } from '../constants';
import { ApiError } from '../types';
import type { AddDocumentResponse } from '../types';
import { buildUrl, parseResponseBody, formatErrorMessage, isNetworkError } from './utils';

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
