// hooks/index.ts

/**
 * Re-export all custom hooks for convenient imports
 */

export { useDebounce, useDebouncedValue } from './useDebounce';
export { useClickOutside } from './useClickOutside';
export { useSuggestions, TOP_SEARCHES, type SuggestionItem } from './useSuggestions';
export { useSearch } from './useSearch';
export { useRecentSearches } from './useRecentSearches';
export { useVisitedLinks } from './useVisitedLinks';
export { useAIOverview } from './useAIOverview';
export { useAIRateLimit } from './useAIRateLimit';
export { useDropdown } from './useDropdown';
export { useSearchState } from './useSearchState';
export { useUIState } from './useUIState';
export { usePagination } from './usePagination';
