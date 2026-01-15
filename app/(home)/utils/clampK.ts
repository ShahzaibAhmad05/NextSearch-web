// app/(home)/utils/clampK.ts

import { SEARCH_CONFIG } from '@/lib/constants';

/**
 * Clamp k value to valid range
 */
export function clampK(v: number): number {
  if (Number.isNaN(v)) return SEARCH_CONFIG.DEFAULT_K;
  return Math.min(
    SEARCH_CONFIG.MAX_K,
    Math.max(SEARCH_CONFIG.MIN_K, Math.trunc(v))
  );
}
