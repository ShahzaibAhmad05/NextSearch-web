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
    <div className="bg-gray-100 min-h-screen">
      {/* Top bar */}
      <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-245 mx-auto px-4 py-3 flex items-center justify-between">
          <a className="font-bold text-lg" href="#">
          </a>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 text-sm font-medium border border-gray-900 rounded-md hover:bg-gray-900 hover:text-white transition-colors"
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
          className="flex items-center justify-center min-h-screen"
        >
          <div className="max-w-250 mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold mb-2">NextSearch</h1>
              <div className="text-gray-500">
                through 60k+ Cord19 research papers
              </div>
            </div>

            <div>
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
        <div className="pt-20">
          <div className="max-w-245 mx-auto px-4 pt-4">
            {/* Hero */}
            <div className="py-6">
              <h1 className="text-4xl font-bold mb-2">NextSearch</h1>
              <div className="text-gray-500">
                through 60k+ Cord19 research papers
              </div>
            </div>

            {/* Search area */}
            <div
              className="bg-gray-100 py-3 sticky z-40"
              style={{ top: 54 }}
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
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
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-600 hover:text-white hover:border-gray-600 transition-colors flex items-center gap-1"
                        type="button"
                        onClick={() => setShowSort((v) => !v)}
                      >
                        Sort by {sortBy}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {showSort && (
                        <div
                          className="absolute left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
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
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-600 hover:text-white transition-colors first:rounded-t-lg last:rounded-b-lg ${
                                opt === sortBy ? "bg-gray-500 text-white" : ""
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
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-600 hover:text-white hover:border-gray-600 transition-colors"
                        onClick={() => setShowAdvanced((v) => !v)}
                        aria-expanded={showAdvanced}
                        aria-haspopup="dialog"
                      >
                        Advanced
                      </button>

                      {showAdvanced && (
                        <div
                          className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-50"
                          role="dialog"
                          aria-label="Advanced search"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-semibold">Advanced search</div>
                              <div className="text-sm text-gray-500">
                                Tune how many results are requested from the backend.
                              </div>
                            </div>

                            <button
                              type="button"
                              className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                              onClick={() => setShowAdvanced(false)}
                              aria-label="Close advanced search"
                            >
                              ×
                            </button>
                          </div>

                          {/* Moved here from the main plate */}
                          {status && (
                            <div className="mt-3 text-sm text-gray-500">
                              {status}
                            </div>
                          )}

                          <hr className="my-3 border-gray-200" />

                          <div className="flex items-center justify-between">
                            <label className="font-semibold text-sm">
                              No. of results (k)
                            </label>
                            <span className="text-sm text-gray-500">{k}</span>
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
                              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={k}
                              min={1}
                              max={100}
                              onChange={(e) => setK(clampK(Number(e.target.value)))}
                            />
                            <button
                              type="button"
                              className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-600 hover:text-white hover:border-gray-600 transition-colors"
                              onClick={() => setK(25)}
                            >
                              25
                            </button>
                            <button
                              type="button"
                              className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-600 hover:text-white hover:border-gray-600 transition-colors"
                              onClick={() => setK(50)}
                            >
                              50
                            </button>
                            <button
                              type="button"
                              className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-600 hover:text-white hover:border-gray-600 transition-colors"
                              onClick={() => setK(100)}
                            >
                              100
                            </button>
                          </div>

                          <div className="mt-2 text-sm text-gray-500">
                            Changing <span className="font-semibold">k</span> re-runs the search automatically.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {error && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
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
