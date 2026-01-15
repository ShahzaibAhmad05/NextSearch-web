// lib/types/ai.ts

/**
 * AI-related type definitions
 */

/**
 * Response from the AI overview API endpoint
 */
export interface AIOverviewResponse {
  /** The query that was executed */
  query: string;
  /** AI-generated overview/summary */
  overview: string;
  /** Sources used for the overview */
  sources?: Array<{
    title: string;
    url?: string;
    docId?: number;
  }>;
  /** Time taken to generate overview (ms) */
  generation_time_ms?: number;
}

/**
 * Response from the result summary API endpoint
 */
export interface ResultSummaryResponse {
  /** The URL of the result being summarized */
  url: string;
  /** AI-generated summary of the result */
  summary: string;
  /** Time taken to generate summary (ms) */
  generation_time_ms?: number;
}
