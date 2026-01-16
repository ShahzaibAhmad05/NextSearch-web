// components/SearchBar.tsx
'use client';

import { useRef, useState, useLayoutEffect, useCallback, type KeyboardEvent } from 'react';
import { Search, History } from 'lucide-react';
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
    <div>
      <div className="flex gap-2 items-center flex-wrap">
        {/* Search input with glow border */}
        <div
          className="relative flex-1 min-w-200 duration-200">
          <Search
            size={22}
            className="text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10"
          />

          <input
            ref={inputRef}
            className={cn("w-full py-3.5 pl-12 pr-4 text-lg bg-black/45 backdrop-blur-sm text-white placeholder-gray-500 rounded-3xl focus:outline-none transition-all duration-300 border border-white/8",
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
  isClosing?: boolean;
}

/**
 * Dropdown list of autocomplete suggestions with icons
 */
function SuggestionsDropdown({
  suggestions,
  activeIndex,
  onSelect,
  onMouseEnter,
  isClosing = false,
}: SuggestionsDropdownProps) {
  return (
    <div className={cn(
      "absolute left-0 right-0 top-full rounded-b-2xl shadow-dark-lg overflow-hidden z-20 bg-[#0e0e19] *:backdrop-blur-sm",
      isClosing ? "animate-scale-out" : "animate-scale-in"
    )}>
      {suggestions.map((suggestion, idx) => (
        <div
          key={`${suggestion.text}-${idx}`}
          className={cn(
            'text-sm px-4 py-2 cursor-pointer transition-all duration-200 flex items-center gap-3',
            idx === activeIndex
              ? 'bg-indigo-500/30 text-white'
              : 'text-gray-300 hover:bg-white/10 hover:text-white'
          )}
          onMouseDown={(e) => {
            // Prevent input blur before we pick
            e.preventDefault();
          }}
          onClick={() => onSelect(suggestion.text)}
          onMouseEnter={() => onMouseEnter(idx)}
        >
          {suggestion.isRecent ? (
            <History size={16} className="text-gray-400 shrink-0" />
          ) : (
            <Search size={16} className="text-gray-400 shrink-0" />
          )}
          <span>{suggestion.text}</span>
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
    <div className="text-sm text-indigo-300 mt-2 flex items-center gap-2 animate-fade-in">
      <Spinner size="sm" />
      <span>Searching…</span>
    </div>
  );
}
