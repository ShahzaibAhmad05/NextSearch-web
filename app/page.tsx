// app/page.tsx
'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { AddDocumentModal } from '@/components';
import { useRecentSearches, useAIOverview, useVisitedLinks, useSearchState, useUIState } from '@/hooks';
import { getSearchStatus } from '@/lib/utils';
import { SORT_OPTIONS } from '@/lib/constants';
import { Navbar, PreSearchView, PostSearchView } from './(home)/components';
import { clampK, getSortedResults } from './(home)/utils';

export default function Home() {
  // Search state management
  const { recentSearches, addSearch, removeSearch, clearHistory } = useRecentSearches();
  
  const {
    query,
    k,
    loading,
    results,
    error,
    found,
    backendTotalMs,
    cached,
    hasSearched,
    setQuery: setSearchQuery,
    setK: setSearchK,
    search: performSearch,
  } = useSearchState({
    onSearchComplete: (query, resultCount) => addSearch(query, resultCount),
  });

  // AI Overview state
  const {
    overview: aiOverview,
    loading: aiOverviewLoading,
    error: aiOverviewError,
    fetchOverview: fetchAIOverview,
    reset: resetAIOverview,
    isRateLimited,
    remainingRequests,
  } = useAIOverview();

  // UI state management
  const {
    showAdvanced,
    isAdvancedClosing,
    showSort,
    sortBy,
    showNonEnglish,
    advancedRef,
    setShowSort,
    setSortBy,
    setShowNonEnglish,
    toggleAdvanced,
    closeAdvanced,
  } = useUIState();

  // Visited links tracking
  const { 
    visitedLinks, 
    isVisited, 
    markVisited, 
    removeVisited, 
    clearHistory: clearVisitedLinks 
  } = useVisitedLinks();

  // Manage modal state
  const [showAddModal, setShowAddModal] = useState(false);

  // Recent searches as simple string array for SearchBar
  const recentSearchQueries = useMemo(
    () => recentSearches.map((s) => s.query),
    [recentSearches]
  );

  // Close advanced popup on scroll
  useEffect(() => {
    if (!showAdvanced) return;

    const handleScroll = () => closeAdvanced();
    window.addEventListener('scroll', handleScroll, true);
    
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [showAdvanced, closeAdvanced]);

  // Submit search with optional AI overview
  const handleSubmit = useCallback(
    async (queryOverride?: string, shouldFetchAI: boolean = true) => {
      const searchQuery = queryOverride || query;
      
      if (shouldFetchAI) {
        resetAIOverview();
        fetchAIOverview(searchQuery);
      }

      await performSearch(queryOverride, shouldFetchAI);
    },
    [query, performSearch, resetAIOverview, fetchAIOverview]
  );

  // Handle k changes and trigger re-search
  const handleKChange = useCallback(
    (newK: number) => {
      const clampedK = clampK(newK);
      setSearchK(clampedK);
      
      if (hasSearched && query.trim()) {
        handleSubmit(undefined, false); // Don't refetch AI overview
      }
    },
    [hasSearched, query, setSearchK, handleSubmit]
  );

  // Generate status message
  const status = useMemo(
    () => getSearchStatus(hasSearched, loading, error, results.length, found, backendTotalMs),
    [hasSearched, loading, error, results.length, found, backendTotalMs]
  );

  // Sorted results based on selected sort option
  const sortedResults = useMemo(
    () => getSortedResults(results, sortBy),
    [results, sortBy]
  );

  // Sort options for dropdown
  const sortOptions = useMemo(
    () => SORT_OPTIONS.map((opt) => ({ value: opt, label: opt })),
    []
  );

  return (
    <div className={hasSearched ? "min-h-screen" : "h-screen overflow-hidden"}>
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

      {!hasSearched && (
        <PreSearchView
          query={query}
          k={k}
          loading={loading}
          recentSearches={recentSearchQueries}
          onChangeQuery={setSearchQuery}
          onChangeK={handleKChange}
          onSubmit={handleSubmit}
          onDeleteSuggestion={removeSearch}
        />
      )}

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
          onChangeQuery={setSearchQuery}
          onChangeK={handleKChange}
          onSubmit={handleSubmit}
          onSortChange={setSortBy}
          onShowSortChange={setShowSort}
          onShowAdvancedChange={toggleAdvanced}
          onCloseAdvanced={closeAdvanced}
          onToggleNonEnglish={setShowNonEnglish}
          onDeleteSuggestion={removeSearch}
        />
      )}

      <AddDocumentModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}
