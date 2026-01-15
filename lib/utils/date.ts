// lib/utils/date.ts

/**
 * Date-related utilities
 */

/**
 * Parse publish_time to milliseconds timestamp
 */
export function publishTimeToMs(iso?: string): number {
  if (!iso) return NaN;
  const t = Date.parse(iso);
  return Number.isNaN(t) ? NaN : t;
}
