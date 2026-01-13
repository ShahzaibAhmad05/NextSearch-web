// hooks/useSuggestions.ts
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { suggest as apiSuggest } from '@/lib/api';
import { SEARCH_CONFIG, UI_CONFIG } from '@/lib/constants';
import type { KeyboardEvent } from 'react';

/**
 * A suggestion item that can be either from API or recent searches
 */
export interface SuggestionItem {
  /** The suggestion text */
  text: string;
  /** Whether this is from recent searches */
  isRecent: boolean;
}

interface UseSuggestionsOptions {
  /** The current query string */
  query: string;
  /** Recent searches to include in suggestions */
  recentSearches?: string[];
  /** Maximum number of suggestions to fetch */
  maxSuggestions?: number;
  /** Debounce delay in ms */
  debounceMs?: number;
  /** Minimum query length before fetching */
  minQueryLength?: number;
}

interface UseSuggestionsReturn {
  /** Array of suggestion items with type info */
  suggestions: SuggestionItem[];
  /** Whether the dropdown should be open */
  isOpen: boolean;
  /** Currently highlighted suggestion index (-1 for none) */
  activeIndex: number;
  /** Whether suggestions are currently being fetched */
  isLoading: boolean;
  /** Set the open state */
  setOpen: (open: boolean) => void;
  /** Set the active index */
  setActiveIndex: (index: number) => void;
  /** Pick a suggestion and close */
  pickSuggestion: (value: string) => string;
  /** Handle keyboard navigation */
  handleKeyDown: (e: KeyboardEvent) => string | null;
  /** Handle input focus */
  handleFocus: () => void;
  /** Handle input blur */
  handleBlur: () => void;
  /** Reset suggestions state */
  reset: () => void;
}

/**
 * A hook that manages autocomplete suggestions with keyboard navigation.
 * Handles fetching, debouncing, focus/blur, and keyboard events.
 * Merges API suggestions with matching recent searches.
 */
export function useSuggestions({
  query,
  recentSearches = [],
  maxSuggestions = SEARCH_CONFIG.MAX_SUGGESTIONS,
  debounceMs = SEARCH_CONFIG.SUGGESTION_DEBOUNCE_MS,
  minQueryLength = SEARCH_CONFIG.MIN_QUERY_LENGTH,
}: UseSuggestionsOptions): UseSuggestionsReturn {
  const [apiSuggestions, setApiSuggestions] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  // Track if input is focused (used to prevent reopening after blur)
  const isActiveRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const blurTimerRef = useRef<number | null>(null);

  const trimmedQuery = query.trim().toLowerCase();

  
  // Merge API suggestions with matching recent searches
  useEffect(() => {
    const merged: SuggestionItem[] = [];
    const seen = new Set<string>();


    // First, add recent searches
    if (trimmedQuery.length === 0) {
      
      // when query is empty, show recent searches immediately
      for (const recent of recentSearches) {
        const recentLower = recent.toLowerCase();
        if (!seen.has(recentLower)) {
          merged.push({ text: recent, isRecent: true });
          seen.add(recentLower);
        }
      }
    } 
    
    // Default: Merge recent searches with the suggestions
    else if (trimmedQuery.length >= minQueryLength) {
      // existing behavior: match recent searches while typing
      for (const recent of recentSearches) {
        const recentLower = recent.toLowerCase();
        if (recentLower.includes(trimmedQuery) && !seen.has(recentLower)) {
          merged.push({ text: recent, isRecent: true });
          seen.add(recentLower);
        }
      }
    }


    // Then add API suggestions (that aren't already in recent)
    for (const suggestion of apiSuggestions) {
      const suggestionLower = suggestion.toLowerCase();
      if (!seen.has(suggestionLower)) {
        merged.push({ text: suggestion, isRecent: false });
        seen.add(suggestionLower);
      }
    }

    // Limit total suggestions
    setSuggestions(merged.slice(0, maxSuggestions));
  }, [apiSuggestions, recentSearches, trimmedQuery, minQueryLength, maxSuggestions]);

  // Fetch suggestions with debounce
  useEffect(() => {
    // Only suggest when there is a meaningful prefix
    if (trimmedQuery.length < minQueryLength) {
      abortRef.current?.abort();
      setApiSuggestions([]);
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    const timer = window.setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);

      try {
        const res = await apiSuggest(query, maxSuggestions, controller.signal);
        const s = Array.isArray(res.suggestions)
          ? res.suggestions.slice(0, maxSuggestions)
          : [];
        setApiSuggestions(s);

        // Only open if input is active (focused)
        setOpen(isActiveRef.current);
        setActiveIndex(-1);
      } catch (e: unknown) {
        // Ignore aborts; suppress other errors quietly
        if (e instanceof Error && e.name === 'AbortError') return;
        setApiSuggestions([]);
        setOpen(false);
        setActiveIndex(-1);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [query, trimmedQuery, maxSuggestions, debounceMs, minQueryLength]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (blurTimerRef.current != null) {
        window.clearTimeout(blurTimerRef.current);
      }
    };
  }, []);

  const pickSuggestion = useCallback((value: string) => {
    // Disable suggestions until re-focus
    isActiveRef.current = false;
    setOpen(false);
    setActiveIndex(-1);
    return value;
  }, []);

  const handleFocus = useCallback(() => {
    isActiveRef.current = true;
    if (suggestions.length > 0) {
      setOpen(true);
    }
  }, [suggestions.length]);

  const handleBlur = useCallback(() => {
    // Mark inactive immediately so async suggestions can't reopen after blur
    isActiveRef.current = false;

    // Delay closing so click events on suggestions can fire
    if (blurTimerRef.current != null) {
      window.clearTimeout(blurTimerRef.current);
    }
    blurTimerRef.current = window.setTimeout(
      () => setOpen(false),
      UI_CONFIG.BLUR_DELAY_MS
    );
  }, []);

  /**
   * Handle keyboard navigation.
   * Returns the selected suggestion value if Enter was pressed on a selection,
   * or null otherwise.
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent): string | null => {
      if (e.key === 'ArrowDown') {
        if (suggestions.length === 0) return null;
        e.preventDefault();
        if (!isActiveRef.current) return null;
        setOpen(true);
        setActiveIndex((prev) => {
          const next = prev + 1;
          return next >= suggestions.length ? 0 : next;
        });
        return null;
      }

      if (e.key === 'ArrowUp') {
        if (suggestions.length === 0) return null;
        e.preventDefault();
        if (!isActiveRef.current) return null;
        setOpen(true);
        setActiveIndex((prev) => {
          const next = prev - 1;
          return next < 0 ? suggestions.length - 1 : next;
        });
        return null;
      }

      if (e.key === 'Escape') {
        if (isOpen) {
          e.preventDefault();
          setOpen(false);
          setActiveIndex(-1);
        }
        return null;
      }

      if (e.key === 'Enter') {
        e.preventDefault();

        // Disable suggestions until refocus + close dropdown immediately
        isActiveRef.current = false;
        setOpen(false);
        setActiveIndex(-1);

        // If a suggestion is selected, return it
        if (isOpen && activeIndex >= 0 && activeIndex < suggestions.length) {
          return suggestions[activeIndex].text;
        }

        return null;
      }

      return null;
    },
    [suggestions, isOpen, activeIndex]
  );

  const reset = useCallback(() => {
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
    isActiveRef.current = false;
  }, []);

  return {
    suggestions,
    isOpen,
    activeIndex,
    isLoading,
    setOpen,
    setActiveIndex,
    pickSuggestion,
    handleKeyDown,
    handleFocus,
    handleBlur,
    reset,
  };
}
