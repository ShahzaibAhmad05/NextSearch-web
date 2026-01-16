// lib/types/components.ts

import type { SearchResult } from './search';

/**
 * Component prop type definitions
 */

/**
 * Props for the SearchBar component
 */
export interface SearchBarProps {
  /** Current search query */
  query: string;
  /** Number of results to fetch */
  k: number;
  /** Whether search is in progress */
  loading: boolean;
  /** Recent search queries for suggestions */
  recentSearches?: string[];
  /** Callback when query changes */
  onChangeQuery: (query: string) => void;
  /** Callback when k value changes */
  onChangeK: (k: number) => void;
  /** Callback to submit search */
  onSubmit: (queryOverride?: string) => void;
}

/**
 * Props for the FeedbackModal component
 */
export interface FeedbackModalProps {
  /** Whether the modal is visible */
  show: boolean;
  /** Callback to close the modal */
  onClose: () => void;
}

/**
 * Props for the AddDocumentModal component
 */
export interface AddDocumentModalProps {
  /** Whether the modal is visible */
  show: boolean;
  /** Callback to close the modal */
  onClose: () => void;
}

/**
 * Props for the SearchResults component
 */
export interface SearchResultsProps {
  /** Array of search results to display */
  results: SearchResult[];
  /** Number of results per page */
  pageSize?: number;
  /** Whether to show non-English results */
  showNonEnglish?: boolean;
}
