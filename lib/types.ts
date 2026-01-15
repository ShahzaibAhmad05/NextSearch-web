// lib/types.ts
// Re-export all types from the new modular structure for backward compatibility

export type {
  SearchResult,
  SearchResponse,
  SuggestResponse,
  AIOverviewResponse,
  ResultSummaryResponse,
  AddDocumentResponse,
  SearchBarProps,
  FeedbackModalProps,
  RecentSearch,
} from './types/index';

export { ApiError } from './types/index';
