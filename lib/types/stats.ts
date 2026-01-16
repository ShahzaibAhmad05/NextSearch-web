// lib/types/stats.ts

/**
 * Stats-related type definitions
 */

/**
 * Feedback entry from the backend
 */
export interface FeedbackEntry {
  type: string; // 'anonymous' | 'replyable'
  email: string | null;
  message: string;
  timestamp: string; // ISO date string
}

/**
 * Stats response from the backend API
 * Matches the /api/stats endpoint response
 */
export interface StatsResponse {
  // Search metrics
  total_searches: number;
  search_cache_hits: number;
  search_cache_hit_rate: number;

  // AI Overview metrics
  ai_overview_calls: number;
  ai_overview_cache_hits: number;
  ai_overview_cache_hit_rate: number;

  // AI Summary metrics
  ai_summary_calls: number;
  ai_summary_cache_hits: number;
  ai_summary_cache_hit_rate: number;

  // AI API quota
  ai_api_calls_remaining: number;
  ai_api_calls_used: number;

  // Feedback metrics
  total_feedback_count: number;
  last_10_feedback: FeedbackEntry[];
}
