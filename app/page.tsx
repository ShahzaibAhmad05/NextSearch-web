// app/page.tsx
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AddDocumentModal } from '@/components';
import { Alert } from '@/components/ui';
import { useClickOutside, useRecentSearches, useAIOverview, useAdminAccess, useVisitedLinks } from '@/hooks';
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
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const [showNonEnglish, setShowNonEnglish] = useState(false);

  // Admin access
  const isAdminActive = useAdminAccess();

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
  const prevKRef = useRef(k);

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
    async (queryOverride?: string) => {
      const q = (queryOverride ?? query).trim();
      if (!q) return;

      setError(null);
      setLoading(true);
      resetAIOverview();

      // Fetch AI overview in parallel (fire and forget - managed by its own hook)
      fetchAIOverview(q);

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

  // Auto-refresh on k change (debounced)
  useEffect(() => {
    if (!hasSearched) {
      prevKRef.current = k;
      return;
    }
    if (prevKRef.current === k) return;

    prevKRef.current = k;
    if (!query.trim()) return;

    const timer = window.setTimeout(() => {
      if (!loading) handleSubmit();
    }, SEARCH_CONFIG.K_CHANGE_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [k, hasSearched, query, loading, handleSubmit]);

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
        onAddDocument={() => {
          if (isAdminActive) {
            setShowAddModal(true);
          } else {
            setShowAuthAlert(true);
            setTimeout(() => setShowAuthAlert(false), 3000);
          }
        }}
        isAdminActive={isAdminActive}
        recentSearches={recentSearches}
        onRemoveSearch={removeSearch}
        onClearHistory={clearHistory}
        visitedLinks={visitedLinks}
        onRemoveVisited={removeVisited}
        onClearVisitedLinks={clearVisitedLinks}
      />

      {/* Auth Alert */}
      {showAuthAlert && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <Alert variant="error" className="shadow-dark-lg">
            Adding data to the index requires admin access. Please authenticate in Settings.
          </Alert>
        </div>
      )}

      {/* Pre-search view (centered hero) */}
      {!hasSearched && (
        <PreSearchView
          query={query}
          k={k}
          loading={loading}
          recentSearches={recentSearchQueries}
          onChangeQuery={setQuery}
          onChangeK={setK}
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
          onChangeK={(v) => setK(clampK(v))}
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
