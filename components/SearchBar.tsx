// components/SearchBar.tsx
'use client';

import { useRef, type KeyboardEvent } from 'react';
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

  const {
    suggestions,
    isOpen,
    activeIndex,
    setActiveIndex,
    handleFocus,
    handleBlur,
    handleKeyDown,
    pickSuggestion,
  } = useSuggestions({ query, recentSearches });

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
        <div className="relative flex-1 min-w-200 glow-border rounded-full">
          <Search
            size={22}
            className="text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10"
          />

          <input
            ref={inputRef}
            className="w-full py-3.5 pl-12 pr-4 text-lg bg-black/45 backdrop-blur-sm border border-white/8 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/10 focus:border-white/15 transition-all duration-300"
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
}

/**
 * Dropdown list of autocomplete suggestions with icons
 */
function SuggestionsDropdown({
  suggestions,
  activeIndex,
  onSelect,
  onMouseEnter,
}: SuggestionsDropdownProps) {
  return (
    <div className="absolute left-0 right-0 top-full mt-2 rounded-xl shadow-dark-lg overflow-hidden z-20 animate-scale-in bg-[#151526]">
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
