// app/(home)/components/PostSearchView.tsx
'use client';

import { useRef } from 'react';
import { SearchBar, SearchResults, AIOverview, Footer } from '@/components';
import { Button, Card, Alert, Dropdown } from '@/components/ui';
import type { SearchResult, AIOverviewResponse } from '@/lib/types';
import type { SortOption } from '@/lib/constants';
import { AdvancedPopover } from './AdvancedPopover';

interface PostSearchViewProps {
  query: string;
  k: number;
  loading: boolean;
  error: string | null;
  status: string;
  cached: boolean;
  sortBy: SortOption;
  sortOptions: Array<{ value: SortOption; label: string }>;
  showAdvanced: boolean;
  isAdvancedClosing: boolean;
  showSort: boolean;
  showNonEnglish: boolean;
  advancedRef: React.RefObject<HTMLDivElement | null>;
  results: SearchResult[];
  recentSearches: string[];
  aiOverview: AIOverviewResponse | null;
  aiOverviewLoading: boolean;
  aiOverviewError: string | null;
  remainingRequests?: number;
  isRateLimited?: boolean;
  isVisited: (url: string) => boolean;
  markVisited: (url: string, title?: string) => void;
  onChangeQuery: (q: string) => void;
  onChangeK: (k: number) => void;
  onSubmit: () => void;
  onSortChange: (sort: SortOption) => void;
  onShowSortChange: (show: boolean) => void;
  onShowAdvancedChange: (show: boolean) => void;
  onCloseAdvanced: () => void;
  onToggleNonEnglish: (show: boolean) => void;
  onDeleteSuggestion?: (query: string) => void;
}

/**
 * Results view shown after search
 */
export function PostSearchView({
  query,
  k,
  loading,
  error,
  status,
  cached,
  sortBy,
  sortOptions,
  showAdvanced,
  isAdvancedClosing,
  showNonEnglish,
  advancedRef,
  results,
  recentSearches,
  aiOverview,
  aiOverviewLoading,
  aiOverviewError,
  remainingRequests,
  isRateLimited,
  isVisited,
  markVisited,
  onChangeQuery,
  onChangeK,
  onSubmit,
  onSortChange,
  onShowAdvancedChange,
  onCloseAdvanced,
  onToggleNonEnglish,
  onDeleteSuggestion,
}: PostSearchViewProps) {
  const hrRef = useRef<HTMLHRElement>(null);
  
  return (
    <div className="pt-12 sm:pt-15 animate-fade-in">
      <div className="max-w-245 mx-auto px-3 sm:px-4 pt-3 sm:pt-4 backdrop-blur-2xl">
        {/* Search area */}
        <div
          className="pt-2 sm:pt-3 sticky z-40 rounded-2xl backdrop-blur-md"
          style={{
            top: 60,
            background:
              'linear-gradient(135deg, rgba(5, 5, 5, 0.8) 20%, rgba(14, 14, 14, 0.8) 50%, rgba(22, 22, 22, 0.8) 100%',
          }}
        >
          <Card className="shadow-dark animate-fade-in-up">
            <SearchBar
              query={query}
              k={k}
              loading={loading}
              recentSearches={recentSearches}
              onChangeQuery={onChangeQuery}
              onChangeK={onChangeK}
              onSubmit={onSubmit}
              onDeleteSuggestion={onDeleteSuggestion}
            />
          </Card>
        </div>

        <div className="mt-4 sm:mt-5 flex flex-row flex-wrap gap-2 items-center">
          {/* Sort dropdown */}
          <Dropdown
            value={sortBy}
            options={sortOptions}
            onChange={onSortChange}
            label="Sort by"
          />

          {/* Advanced popover */}
          <div className="relative" ref={advancedRef as React.RefObject<HTMLDivElement>}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onShowAdvancedChange(!showAdvanced)}
              aria-expanded={showAdvanced}
              aria-haspopup="dialog"
            >
              Advanced
            </Button>

            {showAdvanced && (
              <AdvancedPopover
                k={k}
                status={status}
                cached={cached}
                showNonEnglish={showNonEnglish}
                onChangeK={onChangeK}
                onToggleNonEnglish={onToggleNonEnglish}
                onClose={onCloseAdvanced}
                isClosing={isAdvancedClosing}
              />
            )}
          </div>
        </div>

        {error && (
          <Alert variant="error" className="mt-3">
            <div className="font-semibold">{error}</div>
          </Alert>
        )}

        <hr ref={hrRef} className="my-4 mt-6 border-t border-white/10" />

        {/* AI Overview - shown above results */}
        <div className="px-3 mt-5">
          <AIOverview
            overview={aiOverview}
            loading={aiOverviewLoading}
            remainingRequests={remainingRequests}
            isRateLimited={isRateLimited}
            error={aiOverviewError}
            hrRef={hrRef}
          />
        </div>

        {/* Results */}
        <div className="px-3">
          <SearchResults 
            results={results} 
            showNonEnglish={showNonEnglish}
            isVisited={isVisited}
            markVisited={markVisited}
          />
        </div>

        {/* Footer with scroll-to-top enabled */}
        <hr className="mb-6 border-t border-white/5" />
        <Footer showScrollToTop={true} />
      </div>
    </div>
  );
}
