// src/App.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import AddDocumentModal from "./components/AddDocumentModal";
import { search as apiSearch } from "./api";
import type { SearchResult } from "./types";

type SortBy =
  | "Relevancy"
  | "Publish Date (Newest)"
  | "Publish Date (Oldest)";

function publishTimeToMs(iso?: string) {
  if (!iso) return NaN;
  const t = Date.parse(iso);
  return Number.isNaN(t) ? NaN : t;
}

function clampK(v: number) {
  // Keep sane bounds; backend can still accept larger values if you raise this.
  const min = 1;
  const max = 1000;
  if (Number.isNaN(v)) return 100;
  return Math.min(max, Math.max(min, Math.trunc(v)));
}

export default function App() {
  const [query, setQuery] = useState("");
  const [k, setK] = useState(100);
  const [loading, setLoading] = useState(false);

  const [showAdvanced, setShowAdvanced] = useState(false);

  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [found, setFound] = useState<number | undefined>();

  const [backendTotalMs, setBackendTotalMs] = useState<number | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);

  const [sortBy, setSortBy] = useState<SortBy>("Relevancy");
  const [showSort, setShowSort] = useState(false);

  const advancedWrapRef = useRef<HTMLDivElement | null>(null);
  const prevKRef = useRef(k);

  const onSubmit = useCallback(async () => {
    if (!query.trim()) return;

    setError(null);
    setLoading(true);

    try {
      const data = await apiSearch(query, k);
      setResults(data.results);
      setFound(data.found);
      setHasSearched(true);
      setBackendTotalMs(data.total_time_ms ?? null);
    } catch (e: any) {
      setError(e?.message ?? String(e));
      setResults([]);
      setHasSearched(true);
      setBackendTotalMs(null);
    } finally {
      setLoading(false);
    }
  }, [query, k]);

  // Close Advanced popover when clicking outside / pressing Escape
  useEffect(() => {
    if (!showAdvanced) return;

    function onDocMouseDown(e: MouseEvent) {
      const wrap = advancedWrapRef.current;
      if (!wrap) return;
      if (!wrap.contains(e.target as Node)) setShowAdvanced(false);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setShowAdvanced(false);
    }

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [showAdvanced]);

  // When k changes after a search has happened, automatically re-run the search (debounced).
  useEffect(() => {
    if (!hasSearched) {
      prevKRef.current = k;
      return;
    }
    if (prevKRef.current === k) return;

    prevKRef.current = k;
    if (!query.trim()) return;

    const t = window.setTimeout(() => {
      if (!loading) onSubmit();
    }, 350);

    return () => window.clearTimeout(t);
  }, [k, hasSearched, query, loading, onSubmit]);

  const status = useMemo(() => {
    if (!hasSearched) return "";
    if (loading) return "Searching…";
    if (error) return "Error fetching results";
    if (results.length === 0) return "No results found";

    const n = found ?? results.length;
    const parts: string[] = [`About ${n} result${n === 1 ? "" : "s"}`];

    if (backendTotalMs != null) parts.push(`(${backendTotalMs.toFixed(2)} ms)`);
    return parts.join(" ");
  }, [hasSearched, loading, error, results.length, backendTotalMs, found]);

  const sortedResults = useMemo(() => {
    const copy = [...results];

    if (sortBy !== "Relevancy") {
      copy.sort((a, b) => {
        const ta = publishTimeToMs(a.publish_time);
        const tb = publishTimeToMs(b.publish_time);

        const aBad = Number.isNaN(ta);
        const bBad = Number.isNaN(tb);
        if (aBad && bBad) return 0;
        if (aBad) return 1;
        if (bBad) return -1;

        return sortBy === "Publish Date (Newest)" ? tb - ta : ta - tb;
      });
    }

    return copy;
  }, [results, sortBy]);

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <nav className="glass-card border-b border-white/10 fixed top-0 left-0 right-0 z-50 animate-fade-in">
        <div className="max-w-245 mx-auto px-4 py-3 flex items-center justify-between">
          <a className="font-bold text-lg text-white/90" href="#">
          </a>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 text-sm font-medium border border-indigo-500/50 text-white rounded-lg hover:bg-indigo-500/20 hover:border-indigo-400 hover:shadow-glow transition-all duration-300"
              onClick={() => setShowAddModal(true)}
            >
              Add Document
            </button>
          </div>
        </div>
      </nav>

      {/* ======================
          PRE-SEARCH (CENTERED)
          ====================== */}
      {!hasSearched && (
        <div
          className="flex items-center justify-center min-h-screen animate-fade-in"
        >
          <div className="max-w-250 mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-6xl font-bold mb-3 gradient-text animate-fade-in-up">NextSearch</h1>
              <div className="text-gray-400 text-lg animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                Across 1M+ Cord19 research papers
              </div>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <SearchBar
                query={query}
                k={k}
                loading={loading}
                onChangeQuery={setQuery}
                onChangeK={setK}
                onSubmit={onSubmit}
              />
            </div>
          </div>
        </div>
      )}

      {/* ======================
          POST-SEARCH (NORMAL)
          ====================== */}
      {hasSearched && (
        <div className="pt-20 animate-fade-in">
          <div className="max-w-245 mx-auto px-4 pt-4">
            {/* Hero */}
            <div className="py-6 animate-fade-in-up">
              <h1 className="text-4xl font-bold mb-2 gradient-text">NextSearch</h1>
              <div className="text-gray-400">
                Across 1M+ Cord19 research papers
              </div>
            </div>

            {/* Search area */}
            <div
              className="py-3 sticky z-40"
              style={{ top: 54, background: 'linear-gradient(135deg, rgba(15, 15, 26, 0.95) 0%, rgba(26, 26, 46, 0.95) 100%)' }}
            >
              <div className="glass-card rounded-2xl shadow-dark animate-fade-in-up">
                <div className="p-4">
                  <SearchBar
                    query={query}
                    k={k}
                    loading={loading}
                    onChangeQuery={setQuery}
                    onChangeK={setK}
                    onSubmit={onSubmit}
                  />

                  <div className="mt-3 flex flex-wrap gap-2 items-center">
                    {/* Sort dropdown */}
                    <div className="relative">
                      <button
                        className="px-3 py-1.5 text-sm border border-white/20 text-gray-300 rounded-lg hover:bg-white/10 hover:border-indigo-500/50 hover:text-white transition-all duration-300 flex items-center gap-1"
                        type="button"
                        onClick={() => setShowSort((v) => !v)}
                      >
                        Sort by {sortBy}
                        <svg className="w-4 h-4 transition-transform duration-300" style={{ transform: showSort ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {showSort && (
                        <div
                          className="absolute left-0 mt-2 w-56 glass-card rounded-xl shadow-dark-lg z-50 overflow-hidden animate-scale-in"
                        >
                          {(
                            [
                              "Relevancy",
                              "Publish Date (Newest)",
                              "Publish Date (Oldest)",
                            ] as SortBy[]
                          ).map((opt) => (
                            <button
                              key={opt}
                              className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-200 ${
                                opt === sortBy 
                                  ? "bg-indigo-500/30 text-white" 
                                  : "text-gray-300 hover:bg-white/10 hover:text-white"
                              }`}
                              onClick={() => {
                                setSortBy(opt);
                                setShowSort(false);
                              }}
                              type="button"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Advanced popover */}
                    <div className="relative" ref={advancedWrapRef}>
                      <button
                        type="button"
                        className="px-3 py-1.5 text-sm border border-white/20 text-gray-300 rounded-lg hover:bg-white/10 hover:border-indigo-500/50 hover:text-white transition-all duration-300"
                        onClick={() => setShowAdvanced((v) => !v)}
                        aria-expanded={showAdvanced}
                        aria-haspopup="dialog"
                      >
                        Advanced
                      </button>

                      {showAdvanced && (
                        <div
                          className="absolute right-0 mt-2 w-80 glass-card rounded-2xl shadow-dark-lg p-4 z-50 animate-scale-in"
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
                              onClick={() => setShowAdvanced(false)}
                              aria-label="Close advanced search"
                            >
                              ×
                            </button>
                          </div>

                          {/* Moved here from the main plate */}
                          {status && (
                            <div className="mt-3 text-sm text-indigo-300">
                              {status}
                            </div>
                          )}

                          <hr className="my-3 border-white/10" />

                          <div className="flex items-center justify-between">
                            <label className="font-semibold text-sm text-white">
                              No. of results (k)
                            </label>
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
                              onChange={(e) => setK(clampK(Number(e.target.value)))}
                            />
                          </div>

                          <div className="mt-2 flex gap-2 items-center">
                            <input
                              type="number"
                              className="w-20 px-2 py-1 text-sm bg-white/5 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                              value={k}
                              min={1}
                              max={100}
                              onChange={(e) => setK(clampK(Number(e.target.value)))}
                            />
                            <button
                              type="button"
                              className="px-2 py-1 text-sm border border-white/20 text-gray-300 rounded hover:bg-indigo-500/20 hover:border-indigo-500/50 hover:text-white transition-all duration-200"
                              onClick={() => setK(25)}
                            >
                              25
                            </button>
                            <button
                              type="button"
                              className="px-2 py-1 text-sm border border-white/20 text-gray-300 rounded hover:bg-indigo-500/20 hover:border-indigo-500/50 hover:text-white transition-all duration-200"
                              onClick={() => setK(50)}
                            >
                              50
                            </button>
                            <button
                              type="button"
                              className="px-2 py-1 text-sm border border-white/20 text-gray-300 rounded hover:bg-indigo-500/20 hover:border-indigo-500/50 hover:text-white transition-all duration-200"
                              onClick={() => setK(100)}
                            >
                              100
                            </button>
                          </div>

                          <div className="mt-2 text-sm text-gray-400">
                            Changing <span className="font-semibold text-indigo-300">k</span> re-runs the search automatically.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {error && (
                    <div className="mt-3 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 animate-fade-in">
                      <div className="font-semibold">{error}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="px-3 pb-3">
              <SearchResults results={sortedResults} />
            </div>
          </div>
        </div>
      )}

      <AddDocumentModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}
