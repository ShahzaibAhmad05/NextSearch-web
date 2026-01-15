// lib/utils/formatting.ts

/**
 * Formatting utilities for display
 */

import type { SearchResult } from '../types';
import { VALIDATION } from '../constants';

/**
 * Format the byline for a search result (author + year)
 */
export function formatByline(result: SearchResult): string {
  const authorRaw = result.author;
  const author =
    authorRaw != null && String(authorRaw).trim()
      ? String(authorRaw).trim()
      : '—';

  const dateRaw = result.publish_time;
  const date =
    dateRaw != null && String(dateRaw).trim() ? String(dateRaw).trim() : '';

  const yearMatch = date.match(VALIDATION.YEAR_PATTERN);
  return yearMatch ? `${author} (${yearMatch[1]})` : author;
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Format milliseconds duration for display
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms.toFixed(2)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}
