// lib/utils/url.ts

/**
 * URL-related utilities
 */

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
