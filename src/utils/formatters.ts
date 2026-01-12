// src/utils/formatters.ts

import { VALIDATION } from '../constants';
import type { SearchResult } from '../types';

/**
 * Format the byline for a search result (author + year)
 */
export function formatByline(result: SearchResult): string {
  const authorRaw = result.authors;
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
 * Extract hostname from a URL, removing 'www.' prefix
 */
export function safeHostname(url?: string): string {
  if (!url) return '';
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/**
 * Generate a Google favicon URL for a given website URL
 */
export function faviconUrl(url?: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=64`;
  } catch {
    return null;
  }
}

/**
 * Parse publish_time to milliseconds timestamp
 */
export function publishTimeToMs(iso?: string): number {
  if (!iso) return NaN;
  const t = Date.parse(iso);
  return Number.isNaN(t) ? NaN : t;
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
