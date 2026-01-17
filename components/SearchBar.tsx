// components/SearchBar.tsx
'use client';

import { useRef, useState, useLayoutEffect, useCallback, type KeyboardEvent } from 'react';
import { Search, History, X } from 'lucide-react';
import { useSuggestions, type SuggestionItem } from '@/hooks';
import { Spinner } from './ui';
import { cn } from '@/lib/utils';
import type { SearchBarProps } from '@/lib/types';
import VoiceSearchButton from './VoiceSearchButton';

/**
 * Search input with autocomplete suggestions.
 * Features debounced suggestion fetching, keyboard navigation,
 * and smooth animations.
 */
export default function SearchBar({
  query,
  k,
  loading,
  recentSearches = [],
  onChangeQuery,
  onChangeK,
  onSubmit,
  onDeleteSuggestion,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Memoize the callback to prevent unnecessary hook updates
  const handleBeforeClose = useCallback(() => {
    setIsClosing(true);
  }, []);

  const {
    suggestions,
    isOpen,
    activeIndex,
    setActiveIndex,
    handleFocus,
    handleBlur,
    handleKeyDown,
    pickSuggestion,
  } = useSuggestions({ 
    query, 
    recentSearches,
    onBeforeClose: handleBeforeClose,
    closeDelayMs: 200,
  });

  // Reset isClosing when dropdown opens - use layout effect to run before paint
  useLayoutEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  /**
   * Handle selecting a suggestion
   */
  const selectSuggestion = (value: string) => {
    pickSuggestion(value);
    onChangeQuery(value);
    inputRef.current?.blur();
    onSubmit(value);
  };

  /**
   * Handle voice search result
   */
  const handleVoiceResult = (text: string) => {
    onChangeQuery(text);
    onSubmit(text);
  };

  /**
   * Handle keyboard events
   */
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const selected = handleKeyDown(e);

    if (selected) {
      // A suggestion was selected via Enter
      selectSuggestion(selected);
      return;
    }

    if (e.key === 'Enter' && !selected) {
      // No suggestion selected, just submit
      inputRef.current?.blur();
      if (query.trim()) {
        onSubmit(query);
      }
    }
  };

  return (
    <div className="relative z-50">
      <div className="flex gap-2 items-center flex-wrap">
        {/* Search input with glow border */}
        <div
          className="relative flex-1 min-w-0 w-full sm:min-w-50 duration-200">
          <Search
            size={20}
            className="text-theme-secondary absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10"
          />

          <input
            ref={inputRef}
            className={cn("w-full py-2.5 sm:py-3.5 pl-10 sm:pl-12 pr-3 sm:pr-4 text-base sm:text-lg bg-black/50 backdrop-blur-sm text-theme-primary placeholder-theme-muted rounded-3xl focus:outline-none transition-all duration-200 border border-theme [data-theme='light']_&:bg-white/80",
            isOpen && suggestions.length > 0 && "rounded-b-none"
            )}
            value={query}
            onChange={(e) => onChangeQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={onKeyDown}
            placeholder="Search documents..."
          />

          {/* Suggestions dropdown */}
          {isOpen && suggestions.length > 0 && (
            <SuggestionsDropdown
              suggestions={suggestions}
              activeIndex={activeIndex}
              onSelect={selectSuggestion}
              onMouseEnter={setActiveIndex}
              onDelete={onDeleteSuggestion}
              isClosing={isClosing}
            />
          )}
        </div>

        {/* Voice search button */}
        <VoiceSearchButton
          onVoiceResult={handleVoiceResult}
          disabled={loading}
        />
      </div>

      {/* Loading indicator */}
      {loading && <LoadingIndicator />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

interface SuggestionsDropdownProps {
  suggestions: SuggestionItem[];
  activeIndex: number;
  onSelect: (value: string) => void;
  onMouseEnter: (index: number) => void;
  onDelete?: (value: string) => void;
  isClosing?: boolean;
}

/**
 * Dropdown list of autocomplete suggestions with icons and delete buttons
 */
function SuggestionsDropdown({
  suggestions,
  activeIndex,
  onSelect,
  onMouseEnter,
  onDelete,
  isClosing = false,
}: SuggestionsDropdownProps) {
  return (
    <div className={cn(
      "absolute left-0 right-0 top-full rounded-b-2xl shadow-dark-lg overflow-hidden z-100 bg-[#0a0a0a] backdrop-blur-sm",
      isClosing ? "animate-scale-out" : "animate-scale-in"
    )}>
      {suggestions.map((suggestion, idx) => (
        <div
          key={`${suggestion.text}-${idx}`}
          className={cn(
            'group text-sm px-4 py-2 cursor-pointer transition-colors duration-200 flex items-center gap-3',
            idx === activeIndex
              ? 'bg-green-500/30 text-white'
              : 'text-theme-secondary hover:bg-green-500/20 hover:text-theme-primary'
          )}
          onMouseDown={(e) => {
            // Prevent input blur before we pick
            e.preventDefault();
          }}
          onClick={() => onSelect(suggestion.text)}
          onMouseEnter={() => onMouseEnter(idx)}
        >
          {suggestion.isRecent ? (
            <History size={16} className="text-theme-tertiary shrink-0" />
          ) : (
            <Search size={16} className="text-theme-tertiary shrink-0" />
          )}
          <span className="flex-1">{suggestion.text}</span>
          {onDelete && (
            <>
              {/* Mobile: X icon always visible */}
              <button
                className="shrink-0 p-1 rounded-full hover:bg-red-500/20 transition-colors duration-200 sm:hidden"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(suggestion.text);
                }}
                onMouseDown={(e) => e.preventDefault()}
                aria-label="Delete suggestion"
              >
                <X size={14} className="text-theme-tertiary hover:text-red-400" />
              </button>
              {/* Desktop: "Delete" text on hover */}
              <button
                className="hidden sm:block shrink-0 px-2 py-1 text-xs rounded hover:bg-gray-600/30 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(suggestion.text);
                }}
                onMouseDown={(e) => e.preventDefault()}
                aria-label="Delete suggestion"
              >
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Search loading indicator
 */
function LoadingIndicator() {
  return (
    <div className="text-sm text-theme-secondary bg-clip-text mt-2 flex items-center gap-2 animate-fade-in">
      <Spinner size="sm" />
      <span>Searching…</span>
    </div>
  );
}
