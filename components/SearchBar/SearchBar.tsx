// components/SearchBar/SearchBar.tsx
'use client';

import { useRef, useState, useLayoutEffect, useCallback, type KeyboardEvent } from 'react';
import { Search } from 'lucide-react';
import { useSuggestions } from '@/hooks';
import { cn } from '@/lib/utils';
import type { SearchBarProps } from '@/lib/types';
import VoiceSearchButton from '../VoiceSearchButton';
import { SuggestionsDropdown } from './SuggestionsDropdown';
import { LoadingIndicator } from './LoadingIndicator';

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

  // Reset closing state when dropdown opens
  useLayoutEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  const selectSuggestion = useCallback((value: string) => {
    pickSuggestion(value);
    onChangeQuery(value);
    inputRef.current?.blur();
    onSubmit(value);
  }, [pickSuggestion, onChangeQuery, onSubmit]);

  const handleVoiceResult = useCallback((text: string) => {
    onChangeQuery(text);
    onSubmit(text);
  }, [onChangeQuery, onSubmit]);

  const onKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    const selected = handleKeyDown(e);

    if (selected) {
      selectSuggestion(selected);
      return;
    }

    if (e.key === 'Enter' && !selected) {
      inputRef.current?.blur();
      if (query.trim()) {
        onSubmit(query);
      }
    }
  }, [handleKeyDown, selectSuggestion, query, onSubmit]);

  const showSuggestions = isOpen && suggestions.length > 0;

  return (
    <div className="relative z-50">
      <div className="flex gap-2 items-center flex-wrap">
        <div className="relative flex-1 min-w-0 w-full sm:min-w-50 duration-200">
          <Search
            size={20}
            className="text-gray-300 absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10"
          />

          <input
            ref={inputRef}
            className={cn(
              "w-full py-2.5 sm:py-3.5 pl-10 sm:pl-12 pr-3 sm:pr-4 text-base sm:text-lg bg-black/50 backdrop-blur-sm text-gray-300 placeholder-gray-400 rounded-3xl focus:outline-none transition-all duration-200 border border-white/8",
              showSuggestions && "rounded-b-none"
            )}
            value={query}
            onChange={(e) => onChangeQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={onKeyDown}
            placeholder="Search documents..."
          />

          {showSuggestions && (
            <SuggestionsDropdown
              suggestions={suggestions}
              activeIndex={activeIndex}
              isClosing={isClosing}
              onSelect={selectSuggestion}
              onMouseEnter={setActiveIndex}
              onDelete={onDeleteSuggestion}
            />
          )}
        </div>

        <VoiceSearchButton
          onVoiceResult={handleVoiceResult}
          disabled={loading}
        />
      </div>

      {loading && <LoadingIndicator />}
    </div>
  );
}
