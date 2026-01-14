// app/page.tsx
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SearchBar from '@/components/SearchBar';
import SearchResults from '@/components/SearchResults';
import AddDocumentModal from '@/components/AddDocumentModal';
import Footer from '@/components/Footer';
import { Button, Dropdown, Card, Alert } from '@/components/ui';
import { useClickOutside, useRecentSearches } from '@/hooks';
import { search as apiSearch } from '@/lib/api';
import { publishTimeToMs } from '@/lib/utils';
import { SEARCH_CONFIG, SORT_OPTIONS } from '@/lib/constants';
import type { SearchResult } from '@/lib/types';
import type { SortOption } from '@/lib/constants';

// ─────────────────────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Clamp k value to valid range
 */
function clampK(v: number): number {
  if (Number.isNaN(v)) return SEARCH_CONFIG.DEFAULT_K;
  return Math.min(
    SEARCH_CONFIG.MAX_K,
    Math.max(SEARCH_CONFIG.MIN_K, Math.trunc(v))
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

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
  const [hasSearched, setHasSearched] = useState(false);

  // UI state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('Relevancy');
  const [showSort, setShowSort] = useState(false);

  // Recent searches
  const { recentSearches, addSearch } = useRecentSearches();

  // Extract just the query strings for the SearchBar
  const recentSearchQueries = useMemo(
    () => recentSearches.map((s) => s.query),
    [recentSearches]
  );

  // Refs
  const advancedRef = useClickOutside<HTMLDivElement>(
    () => setShowAdvanced(false),
    showAdvanced
  );
  const prevKRef = useRef(k);

  // Submit search
  const handleSubmit = useCallback(
    async (queryOverride?: string) => {
      const q = (queryOverride ?? query).trim();
      if (!q) return;

      setError(null);
      setLoading(true);

      try {
        const data = await apiSearch(q, k);
        setResults(data.results);
        setFound(data.found);
        setHasSearched(true);
        setBackendTotalMs(data.total_time_ms ?? null);

        // Add to recent searches
        addSearch(q, data.found ?? data.results.length);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
        setResults([]);
        setHasSearched(true);
        setBackendTotalMs(null);
      } finally {
        setLoading(false);
      }
    },
    [query, k, addSearch]
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

  // Status message
  const status = useMemo(() => {
    if (!hasSearched) return '';
    if (loading) return 'Searching…';
    if (error) return 'Error fetching results';
    if (results.length === 0) return 'No results found';

    const n = found ?? results.length;
    const parts: string[] = [`About ${n} result${n === 1 ? '' : 's'}`];

    if (backendTotalMs != null) parts.push(`(${backendTotalMs.toFixed(2)} ms)`);
    return parts.join(' ');
  }, [hasSearched, loading, error, results.length, backendTotalMs, found]);

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
      <Navbar onAddDocument={() => setShowAddModal(true)} />

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
          sortBy={sortBy}
          sortOptions={sortOptions}
          showAdvanced={showAdvanced}
          showSort={showSort}
          advancedRef={advancedRef}
          results={sortedResults}
          recentSearches={recentSearchQueries}
          onChangeQuery={setQuery}
          onChangeK={(v) => setK(clampK(v))}
          onSubmit={handleSubmit}
          onSortChange={setSortBy}
          onShowSortChange={setShowSort}
          onShowAdvancedChange={setShowAdvanced}
        />
      )}

      {/* Add document modal */}
      <AddDocumentModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      {/* Footer - only show in pre-search view */}
      {!hasSearched && <Footer />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

interface NavbarProps {
  onAddDocument: () => void;
}

/**
 * Fixed navigation bar
 */
function Navbar({ onAddDocument }: NavbarProps) {
  return (
    <nav className="glass-card border-b border-white/10 fixed top-0 left-0 right-0 z-50 animate-fade-in">
      <div className="max-w-245 mx-auto px-4 py-3 flex items-center justify-between">
        <a className="font-bold text-xl text-white/90" href="/">
          <span className="gradient-text">Next</span>
          <span className="text-white">Search</span>
        </a>
        <div className="flex items-center gap-2">
          <a
            href="/about"
            className="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            About
          </a>
          <Button
            variant="secondary"
            className="px-3! py-0.5! m-0! h-auto! leading-none! inline-flex items-center"
            onClick={onAddDocument}
          >
            <span className="text-2xl leading-none relative -top-px -mx-0.5 pb-1">+</span>
            <span>Index</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}

interface PreSearchViewProps {
  query: string;
  k: number;
  loading: boolean;
  recentSearches: string[];
  onChangeQuery: (q: string) => void;
  onChangeK: (k: number) => void;
  onSubmit: () => void;
}

const TAGLINES = [
  'Discover insights across 1M+ CORD-19 research papers',
  'A powerful crawler for the CORD-19 dataset',
];

/**
 * Centered hero view shown before first search
 */
function PreSearchView({
  query,
  k,
  loading,
  recentSearches,
  onChangeQuery,
  onChangeK,
  onSubmit,
}: PreSearchViewProps) {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Rotate taglines
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
        setIsTransitioning(false);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-250 mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold mb-4 gradient-text animate-fade-in-down opacity-0" style={{ animationDelay: '100ms' }}>
            NextSearch
          </h1>
          <div
            className="tagline-container text-gray-400 text-lg animate-fade-in-down opacity-0"
            style={{ animationDelay: '300ms' }}
          >
            <div
              className={`tagline-text ${isTransitioning ? 'exit' : 'active'}`}
            >
              {TAGLINES[taglineIndex]}
            </div>
          </div>
        </div>

        <div className="animate-slide-up-fade opacity-0" style={{ animationDelay: '500ms' }}>
          <SearchBar
            query={query}
            k={k}
            loading={loading}
            recentSearches={recentSearches}
            onChangeQuery={onChangeQuery}
            onChangeK={onChangeK}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </div>
  );
}

interface PostSearchViewProps {
  query: string;
  k: number;
  loading: boolean;
  error: string | null;
  status: string;
  sortBy: SortOption;
  sortOptions: Array<{ value: SortOption; label: string }>;
  showAdvanced: boolean;
  showSort: boolean;
  advancedRef: React.RefObject<HTMLDivElement | null>;
  results: SearchResult[];
  recentSearches: string[];
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
function PostSearchView({
  query,
  k,
  loading,
  error,
  status,
  sortBy,
  sortOptions,
  showAdvanced,
  advancedRef,
  results,
  recentSearches,
  onChangeQuery,
  onChangeK,
  onSubmit,
  onSortChange,
  onShowAdvancedChange,
}: PostSearchViewProps) {
  return (
    <div className="pt-15 animate-fade-in">
      <div className="max-w-245 mx-auto px-4 pt-4">
        {/* Hero Removed for now */}
        {/* <div className="py-6 animate-fade-in-up">
          <h1 className="text-4xl font-bold mb-2 gradient-text">NextSearch</h1>
          <div className="text-gray-400">Across 1M+ Cord19 research papers</div>
        </div> */}

        {/* Search area */}
        <div
          className="py-3 sticky z-40"
          style={{
            top: 60,
            background:
            //   'linear-gradient(135deg, rgba(15, 15, 26, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%)',
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
        <br />
        <hr />
          

        {/* Results */}
        <div className="px-3">
          <SearchResults results={results} />
        </div>
      </div>
    </div>
  );
}

interface AdvancedPopoverProps {
  k: number;
  status: string;
  onChangeK: (k: number) => void;
  onClose: () => void;
}

/**
 * Advanced search options popover
 */
function AdvancedPopover({ k, status, onChangeK, onClose }: AdvancedPopoverProps) {
  return (
    <div
      className="absolute right-0 mt-2 w-80 rounded-2xl shadow-dark-lg p-4 z-50 animate-scale-in  bg-[#151526]"
      role="dialog"
      aria-label="Advanced search"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-semibold text-white">Advanced search</div>
          <div className="text-sm text-gray-400">
            Tune how many results are requested from the backend.
          </div>
        </div>

        <button
          type="button"
          className="px-2 py-1 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all duration-200"
          onClick={onClose}
          aria-label="Close advanced search"
        >
          ×
        </button>
      </div>

      {status && <div className="mt-3 text-sm text-indigo-300">{status}</div>}

      <hr className="my-3 border-white/10" />

      <div className="flex items-center justify-between">
        <label className="font-semibold text-sm text-white">No. of results (k)</label>
        <span className="text-sm text-indigo-300">{k}</span>
      </div>

      <div className="mt-2">
        <input
          type="range"
          className="w-full"
          min={1}
          max={100}
          step={1}
          value={k}
          onChange={(e) => onChangeK(Number(e.target.value))}
        />
      </div>

      <div className="mt-2 flex gap-2 items-center">
        <input
          type="number"
          className="w-20 px-2 py-1 text-sm bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
          value={k}
          min={1}
          max={100}
          onChange={(e) => onChangeK(Number(e.target.value))}
        />
        {[25, 50, 100].map((preset) => (
          <button
            key={preset}
            type="button"
            className="px-2 py-1 text-sm border border-white/20 text-gray-300 rounded hover:bg-indigo-500/20 hover:border-indigo-500/50 hover:text-white transition-all duration-200"
            onClick={() => onChangeK(preset)}
          >
            {preset}
          </button>
        ))}
      </div>

      <div className="mt-2 text-sm text-gray-400">
        Changing <span className="font-semibold text-indigo-300">k</span> re-runs the
        search automatically.
      </div>
    </div>
  );
}
