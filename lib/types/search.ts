// lib/types/search.ts

/**
 * Search-related type definitions
 */

/**
 * A single search result from the backend
 */
export interface SearchResult {
  /** Internal document ID */
  docId: number;
  /** Relevance score from the search engine */
  score: number;
  /** Document title */
  title: string;
  /** Index segment the document belongs to */
  segment: string;
  /** CORD-19 unique identifier */
  cord_uid: string;
  /** Relative path to the JSON file */
  json_relpath: string;
  /** URL to the original paper (optional) */
  url?: string;
  /** Publication date in ISO format (optional) */
  publish_time?: string;
  /** Author name(s) (optional) */
  author?: string;
}

/**
 * Response from the search API endpoint
 */
export interface SearchResponse {
  /** The query that was executed */
  query: string;
  /** Number of results requested */
  k?: number;
  /** Number of index segments searched */
  segments?: number;
  /** Time spent in search operation (ms) */
  search_time_ms?: number;
  /** Total request time including overhead (ms) */
  total_time_ms?: number;
  /** Total number of matching documents */
  found?: number;
  /** Whether the results were served from cache */
  cached?: boolean;
  /** Time spent looking up cache (ms) */
  cache_lookup_ms?: number;
  /** Array of search results */
  results: SearchResult[];
}

/**
 * Response from the suggest API endpoint
 */
export interface SuggestResponse {
  /** The query prefix used for suggestions */
  query: string;
  /** Maximum number of suggestions requested */
  limit?: number;
  /** Array of suggestion strings */
  suggestions: string[];
}
