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
  showSort: boolean;
  advancedRef: React.RefObject<HTMLDivElement | null>;
  results: SearchResult[];
  recentSearches: string[];
  aiOverview: AIOverviewResponse | null;
  aiOverviewLoading: boolean;
  aiOverviewError: string | null;
  onChangeQuery: (q: string) => void;
  onChangeK: (k: number) => void;
  onSubmit: () => void;
  onSortChange: (sort: SortOption) => void;
  onShowSortChange: (show: boolean) => void;
  onShowAdvancedChange: (show: boolean) => void;
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
  advancedRef,
  results,
  recentSearches,
  aiOverview,
  aiOverviewLoading,
  aiOverviewError,
  onChangeQuery,
  onChangeK,
  onSubmit,
  onSortChange,
  onShowAdvancedChange,
}: PostSearchViewProps) {
  const hrRef = useRef<HTMLHRElement>(null);
  
  return (
    <div className="pt-15 animate-fade-in">
      <div className="max-w-245 mx-auto px-4 pt-4">
        {/* Search area */}
        <div
          className="py-3 sticky z-40"
          style={{
            top: 60,
            background:
              'linear-gradient(135deg, rgba(20, 20, 31, 0.8) 0%, rgba(26, 26, 46, 0.8) 50%, rgba(18, 28, 55, 0.5) 100%)',
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
            />
          </Card>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 items-center">
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
                onChangeK={onChangeK}
                onClose={() => onShowAdvancedChange(false)}
              />
            )}
          </div>
        </div>

        {error && (
          <Alert variant="error" className="mt-3">
            <div className="font-semibold">{error}</div>
          </Alert>
        )}

        <hr ref={hrRef} className="my-4 mt-6 border-t border-[#acbcff73]" />

        {/* AI Overview - shown above results */}
        <div className="px-3 mt-5">
          <AIOverview
            overview={aiOverview}
            loading={aiOverviewLoading}
            error={aiOverviewError}
            hrRef={hrRef}
          />
        </div>

        {/* Results */}
        <div className="px-3">
          <SearchResults results={results} />
        </div>

        {/* Footer with scroll-to-top enabled */}
        <hr className="mb-6 border-t border-[#acbcff30]" />
        <Footer showScrollToTop={true} />
      </div>
    </div>
  );
}
