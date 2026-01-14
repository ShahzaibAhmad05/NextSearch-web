// lib/types.ts

/**
 * Type definitions for the NextSearch application
 */

// ─────────────────────────────────────────────────────────────────────────────
// Search Result Types
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// API Response Types
// ─────────────────────────────────────────────────────────────────────────────

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
  /** Array of search results */
  results: SearchResult[];
}

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

/**
 * Response from the add_document API endpoint
 */
export interface AddDocumentResponse {
  /** Number of documents indexed */
  docs_indexed?: number;
  /** Segment the documents were indexed into */
  segment?: string;
  /** Whether the index was reloaded */
  reloaded?: boolean;
  /** Total time for the operation (ms) */
  total_time_ms?: number;
  /** Error message if operation failed */
  error?: string;
  /** Additional error details */
  details?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// API Error Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Custom error class for API-related errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly endpoint?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Component Props Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Props for the SearchBar component
 */
export interface SearchBarProps {
  /** Current search query */
  query: string;
  /** Number of results to fetch */
  k: number;
  /** Whether a search is in progress */
  loading: boolean;
  /** Recent search queries for suggestions */
  recentSearches?: string[];
  /** Callback when query changes */
  onChangeQuery: (query: string) => void;
  /** Callback when k changes */
  onChangeK: (k: number) => void;
  /** Callback when search is submitted */
  onSubmit: (queryOverride?: string) => void;
}

/**
 * Props for the SearchResults component
 */
export interface SearchResultsProps {
  /** Array of search results to display */
  results: SearchResult[];
  /** Number of results per page (default: 10) */
  pageSize?: number;
}

/**
 * Props for the AddDocumentModal component
 */
export interface AddDocumentModalProps {
  /** Whether the modal is visible */
  show: boolean;
  /** Callback when modal should close */
  onClose: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Makes specified properties of T required
 */
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Extracts the resolved type from a Promise
 */
export type Awaited<T> = T extends Promise<infer U> ? U : T;
