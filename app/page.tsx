// app/page.tsx
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AddDocumentModal } from '@/components';
import { useClickOutside, useRecentSearches, useAIOverview, useVisitedLinks } from '@/hooks';
import { search as apiSearch } from '@/lib/api';
import { publishTimeToMs } from '@/lib/utils';
import { SEARCH_CONFIG, SORT_OPTIONS } from '@/lib/constants';
import type { SearchResult, AIOverviewResponse } from '@/lib/types';
import type { SortOption } from '@/lib/constants';
import { Navbar, PreSearchView, PostSearchView } from './(home)/components';
import { clampK } from './(home)/utils';

/**
 * Main application component.
 * Manages search state and renders the appropriate view (pre-search vs post-search).
 */
export default function Home() {
  // Search state
  const [query, setQuery] = useState('');
  const [k, setK] = useState<number>(SEARCH_CONFIG.DEFAULT_K);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [found, setFound] = useState<number | undefined>();
  const [backendTotalMs, setBackendTotalMs] = useState<number | null>(null);
  const [cached, setCached] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState(false);

  // AI Overview
  const {
    overview: aiOverview,
    loading: aiOverviewLoading,
    error: aiOverviewError,
    fetchOverview: fetchAIOverview,
    reset: resetAIOverview,
    isRateLimited,
    remainingRequests,
  } = useAIOverview();

  // UI state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isAdvancedClosing, setIsAdvancedClosing] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('Relevancy');
  const [showSort, setShowSort] = useState(false);
  const [showNonEnglish, setShowNonEnglish] = useState(false);

  // Recent searches
  const { recentSearches, addSearch, removeSearch, clearHistory } = useRecentSearches();

  // Visited links
  const { visitedLinks, isVisited, markVisited, removeVisited, clearHistory: clearVisitedLinks } = useVisitedLinks();

  // Extract just the query strings for the SearchBar
  const recentSearchQueries = useMemo(
    () => recentSearches.map((s) => s.query),
    [recentSearches]
  );

  // Close advanced with animation
  const handleCloseAdvanced = useCallback(() => {
    setIsAdvancedClosing(true);
    setTimeout(() => {
      setShowAdvanced(false);
      setIsAdvancedClosing(false);
    }, 200); // Match animation duration
  }, []);

  // Refs
  const advancedRef = useClickOutside<HTMLDivElement>(
    handleCloseAdvanced,
    showAdvanced
  );

  // Close advanced popup on scroll
  useEffect(() => {
    if (!showAdvanced) return;

    function handleScroll() {
      handleCloseAdvanced();
    }

    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [showAdvanced, handleCloseAdvanced]);

  // Submit search
  const handleSubmit = useCallback(
    async (queryOverride?: string, shouldFetchAI: boolean = true) => {
      const q = (queryOverride ?? query).trim();
      if (!q) return;

      setError(null);
      setLoading(true);

      // Only fetch AI overview for new queries, not when just changing k
      if (shouldFetchAI) {
        resetAIOverview();
        fetchAIOverview(q);
      }

      try {
        const data = await apiSearch(q, k);
        setResults(data.results);
        setFound(data.found);
        setHasSearched(true);
        setBackendTotalMs(data.total_time_ms ?? null);
        setCached(data.cached ?? false);

        // Add to recent searches
        addSearch(q, data.found ?? data.results.length);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
        setResults([]);
        setHasSearched(true);
        setBackendTotalMs(null);
        setCached(false);
      } finally {
        setLoading(false);
      }
    },
    [query, k, addSearch, resetAIOverview, fetchAIOverview]
  );

  // Trigger new search when k changes (after slider is released)
  const handleKChange = useCallback((newK: number) => {
    setK(newK);
    // Only re-search if we have already searched before
    if (hasSearched && query.trim()) {
      handleSubmit(undefined, false); // Don't refetch AI overview
    }
  }, [hasSearched, query, handleSubmit]);

  // Format number to show first 3 significant digits
  const formatResultCount = (count: number): string => {
    if (count < 1000) return count.toString();
    
    const magnitude = Math.floor(Math.log10(count));
    const divisor = Math.pow(10, magnitude - 2);
    const rounded = Math.round(count / divisor) * divisor;
    
    return rounded.toLocaleString();
  };

  // Status message
  const status = useMemo(() => {
    if (!hasSearched) return '';
    if (loading) return 'Searching…';
    if (error) return 'Error fetching results';
    if (results.length === 0) return 'No results found';

    const n = found ?? results.length;
    const formattedCount = formatResultCount(n);
    const parts: string[] = [`About ${formattedCount} result${n === 1 ? '' : 's'}`];

    if (backendTotalMs != null) {
      parts.push(`(${backendTotalMs.toFixed(2)} ms)`);
    }
    return parts.join(' ');
  }, [hasSearched, loading, error, results.length, backendTotalMs, found, cached]);

  // Sorted results
  const sortedResults = useMemo(() => {
    const copy = [...results];

    if (sortBy !== 'Relevancy') {
      copy.sort((a, b) => {
        const ta = publishTimeToMs(a.publish_time);
        const tb = publishTimeToMs(b.publish_time);

        const aBad = Number.isNaN(ta);
        const bBad = Number.isNaN(tb);
        if (aBad && bBad) return 0;
        if (aBad) return 1;
        if (bBad) return -1;

        return sortBy === 'Publish Date (Newest)' ? tb - ta : ta - tb;
      });
    }

    return copy;
  }, [results, sortBy]);

  // Sort options for dropdown
  const sortOptions = useMemo(
    () => SORT_OPTIONS.map((opt) => ({ value: opt, label: opt })),
    []
  );

  return (
    <div className={hasSearched ? "min-h-screen" : "h-screen overflow-hidden"}>
      {/* Navigation bar */}
      <Navbar
        onAddDocument={() => setShowAddModal(true)}
        recentSearches={recentSearches}
        onRemoveSearch={removeSearch}
        onClearHistory={clearHistory}
        onSelectSearch={handleSubmit}
        visitedLinks={visitedLinks}
        onRemoveVisited={removeVisited}
        onClearVisitedLinks={clearVisitedLinks}
      />

      {/* Pre-search view (centered hero) */}
      {!hasSearched && (
        <PreSearchView
          query={query}
          k={k}
          loading={loading}
          recentSearches={recentSearchQueries}
          onChangeQuery={setQuery}
          onChangeK={handleKChange}
          onSubmit={handleSubmit}
          onDeleteSuggestion={removeSearch}
        />
      )}

      {/* Post-search view (results) */}
      {hasSearched && (
        <PostSearchView
          query={query}
          k={k}
          loading={loading}
          error={error}
          status={status}
          cached={cached}
          sortBy={sortBy}
          sortOptions={sortOptions}
          showAdvanced={showAdvanced}
          isAdvancedClosing={isAdvancedClosing}
          showSort={showSort}
          showNonEnglish={showNonEnglish}
          advancedRef={advancedRef}
          results={sortedResults}
          recentSearches={recentSearchQueries}
          aiOverview={aiOverview}
          aiOverviewLoading={aiOverviewLoading}
          aiOverviewError={aiOverviewError}
          remainingRequests={remainingRequests}
          isRateLimited={isRateLimited}
          isVisited={isVisited}
          markVisited={markVisited}
          onChangeQuery={setQuery}
          onChangeK={(v) => handleKChange(clampK(v))}
          onSubmit={handleSubmit}
          onSortChange={setSortBy}
          onShowSortChange={setShowSort}
          onShowAdvancedChange={setShowAdvanced}
          onCloseAdvanced={handleCloseAdvanced}
          onToggleNonEnglish={setShowNonEnglish}
          onDeleteSuggestion={removeSearch}
        />
      )}

      {/* Add document modal */}
      <AddDocumentModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}
