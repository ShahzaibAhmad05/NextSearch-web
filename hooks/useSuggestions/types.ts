// hooks/useSuggestions/types.ts

export interface SuggestionItem {
  text: string;
  isRecent: boolean;
  isTopSearch?: boolean;
  icon?: string;
}

export interface UseSuggestionsOptions {
  query: string;
  recentSearches?: string[];
  maxSuggestions?: number;
  debounceMs?: number;
  minQueryLength?: number;
  onBeforeClose?: () => void;
  closeDelayMs?: number;
}

export interface UseSuggestionsReturn {
  suggestions: SuggestionItem[];
  isOpen: boolean;
  activeIndex: number;
  isLoading: boolean;
  setOpen: (open: boolean) => void;
  setActiveIndex: (index: number) => void;
  pickSuggestion: (value: string) => string;
  handleKeyDown: (e: React.KeyboardEvent) => string | null;
  handleFocus: () => void;
  handleBlur: () => void;
  reset: () => void;
}
