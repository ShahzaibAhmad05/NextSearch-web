// lib/types/index.ts

/**
 * Centralized type exports
 */

// Search types
export type {
  SearchResult,
  SearchResponse,
  SuggestResponse,
} from './search';

// AI types
export type {
  AIOverviewResponse,
  ResultSummaryResponse,
} from './ai';

// Document types
export type {
  AddDocumentResponse,
} from './document';

// Error types
export { ApiError } from './errors';

// Component types
export type {
  SearchBarProps,
  FeedbackModalProps,
  AddDocumentModalProps,
  SearchResultsProps,
} from './components';

// Shared types
export type {
  RecentSearch,
} from './shared';
