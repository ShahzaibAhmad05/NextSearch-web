// hooks/useSuggestions/useSuggestions.ts
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { suggest as apiSuggest } from '@/lib/api';
import { SEARCH_CONFIG, UI_CONFIG } from '@/lib/constants';
import type { UseSuggestionsOptions, UseSuggestionsReturn, SuggestionItem } from './types';
import { mergeSuggestions } from './utils';

export function useSuggestions({
  query,
  recentSearches = [],
  maxSuggestions = SEARCH_CONFIG.MAX_SUGGESTIONS,
  debounceMs = SEARCH_CONFIG.SUGGESTION_DEBOUNCE_MS,
  minQueryLength = SEARCH_CONFIG.MIN_QUERY_LENGTH,
  onBeforeClose,
  closeDelayMs = 200,
}: UseSuggestionsOptions): UseSuggestionsReturn {
  const [apiSuggestions, setApiSuggestions] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const isActiveRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const blurTimerRef = useRef<number | null>(null);

  // Merge API suggestions with recent searches
  useEffect(() => {
    const merged = mergeSuggestions(
      apiSuggestions,
      recentSearches,
      query,
      minQueryLength,
      maxSuggestions
    );
    setSuggestions(merged);
  }, [apiSuggestions, recentSearches, query, minQueryLength, maxSuggestions]);

  // Fetch API suggestions with debounce
  useEffect(() => {
    const trimmedQuery = query.trim();

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
        const newSuggestions = Array.isArray(res.suggestions)
          ? res.suggestions.slice(0, maxSuggestions)
          : [];
        setApiSuggestions(newSuggestions);
        setOpen(isActiveRef.current);
        setActiveIndex(-1);
      } catch (e: unknown) {
        if (e instanceof Error && e.name === 'AbortError') return;
        setApiSuggestions([]);
        setOpen(false);
        setActiveIndex(-1);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [query, maxSuggestions, debounceMs, minQueryLength]);

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
    isActiveRef.current = false;

    if (onBeforeClose) {
      onBeforeClose();
    }

    if (blurTimerRef.current != null) {
      window.clearTimeout(blurTimerRef.current);
    }

    const delay = onBeforeClose ? closeDelayMs : UI_CONFIG.BLUR_DELAY_MS;
    blurTimerRef.current = window.setTimeout(() => setOpen(false), delay);
  }, [onBeforeClose, closeDelayMs]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent): string | null => {
      switch (e.key) {
        case 'ArrowDown':
          return handleArrowDown(e, suggestions, isActiveRef, setOpen, setActiveIndex);
        case 'ArrowUp':
          return handleArrowUp(e, suggestions, isActiveRef, setOpen, setActiveIndex);
        case 'Escape':
          return handleEscape(e, isOpen, onBeforeClose, closeDelayMs, setOpen, setActiveIndex);
        case 'Enter':
          return handleEnter(e, isOpen, activeIndex, suggestions, isActiveRef, setOpen, setActiveIndex);
        default:
          return null;
      }
    },
    [suggestions, isOpen, activeIndex, onBeforeClose, closeDelayMs]
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

// Keyboard handlers
function handleArrowDown(
  e: React.KeyboardEvent,
  suggestions: SuggestionItem[],
  isActiveRef: React.MutableRefObject<boolean>,
  setOpen: (open: boolean) => void,
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>
): null {
  if (suggestions.length === 0 || !isActiveRef.current) return null;
  
  e.preventDefault();
  setOpen(true);
  setActiveIndex((prev) => (prev + 1) % suggestions.length);
  return null;
}

function handleArrowUp(
  e: React.KeyboardEvent,
  suggestions: SuggestionItem[],
  isActiveRef: React.MutableRefObject<boolean>,
  setOpen: (open: boolean) => void,
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>
): null {
  if (suggestions.length === 0 || !isActiveRef.current) return null;
  
  e.preventDefault();
  setOpen(true);
  setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
  return null;
}

function handleEscape(
  e: React.KeyboardEvent,
  isOpen: boolean,
  onBeforeClose: (() => void) | undefined,
  closeDelayMs: number,
  setOpen: (open: boolean) => void,
  setActiveIndex: (index: number) => void
): null {
  if (!isOpen) return null;
  
  e.preventDefault();
  
  if (onBeforeClose) {
    onBeforeClose();
    setTimeout(() => {
      setOpen(false);
      setActiveIndex(-1);
    }, closeDelayMs);
  } else {
    setOpen(false);
    setActiveIndex(-1);
  }
  
  return null;
}

function handleEnter(
  e: React.KeyboardEvent,
  isOpen: boolean,
  activeIndex: number,
  suggestions: SuggestionItem[],
  isActiveRef: React.MutableRefObject<boolean>,
  setOpen: (open: boolean) => void,
  setActiveIndex: (index: number) => void
): string | null {
  e.preventDefault();
  
  isActiveRef.current = false;
  setOpen(false);
  setActiveIndex(-1);

  if (isOpen && activeIndex >= 0 && activeIndex < suggestions.length) {
    return suggestions[activeIndex].text;
  }

  return null;
}
