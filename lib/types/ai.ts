// lib/types/ai.ts

/**
 * AI-related type definitions
 */

/**
 * Response from the AI overview API endpoint
 */
export interface AIOverviewResponse {
  /** Whether the overview was served from cache */
  cached?: boolean;
  /** The query that was executed */
  query: string;
  /** AI-generated overview/summary */
  overview: string;
  /** AI model used for generation */
  model: string;
  /** Token usage statistics */
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Response from the AI summary API endpoint
 */
export interface ResultSummaryResponse {
  /** Whether the summary was served from cache */
  cached: boolean;
  /** CORD-19 unique identifier */
  cord_uid: string;
  /** AI-generated summary in Markdown format */
  summary: string;
}
