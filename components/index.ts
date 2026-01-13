// components/index.ts
// Re-export all components for cleaner imports

export { default as SearchBar } from './SearchBar';
export { default as SearchResults } from './SearchResults';
export { default as AddDocumentModal } from './AddDocumentModal';
export { default as RecentSearches } from './RecentSearches';
export { default as Footer } from './Footer';
export { default as SearchFilters, defaultFilters } from './SearchFilters';
export { default as VoiceSearchButton } from './VoiceSearchButton';
export type { SearchFiltersState } from './SearchFilters';

// Re-export UI components
export * from './ui';

// Re-export search components
export * from './search';
