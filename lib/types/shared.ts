// lib/types/shared.ts

/**
 * Shared types used across multiple parts of the application
 */

export interface RecentSearch {
  query: string;
  timestamp: number;
  resultCount?: number;
}
