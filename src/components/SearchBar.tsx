// src/components/SearchBar.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { suggest as apiSuggest } from "../api";

type Props = {
  query: string;
  k: number;
  loading: boolean;
  onChangeQuery: (q: string) => void;
  onChangeK: (k: number) => void;
  onSubmit: () => void;
};

export default function SearchBar({
  query,
  k,
  loading,
  onChangeQuery,
  onChangeK,
  onSubmit,
}: Props) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number>(-1);

  // NEW: gate suggestions by whether input is active/focused
  const [isActive, setIsActive] = useState(false);
  const isActiveRef = useRef(false);

  const abortRef = useRef<AbortController | null>(null);
  const blurTimerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const trimmed = useMemo(() => query.trim(), [query]);

  useEffect(() => {
    // Only suggest when there is a meaningful prefix
    if (trimmed.length < 2) {
      abortRef.current?.abort();
      setSuggestions([]);
      setOpen(false);
      setActiveIdx(-1);
      return;
    }

    const t = window.setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await apiSuggest(query, 5, controller.signal);
        const s = Array.isArray(res.suggestions) ? res.suggestions.slice(0, 5) : [];
        setSuggestions(s);

        // IMPORTANT: only open if input is active (focused)
        setOpen(isActiveRef.current && s.length > 0);
        setActiveIdx(-1);
      } catch (e: any) {
        // Ignore aborts; suppress other errors quietly (no UI changes requested)
        if (e?.name === "AbortError") return;
        setSuggestions([]);
        setOpen(false);
        setActiveIdx(-1);
      }
    }, 180);

    return () => window.clearTimeout(t);
  }, [query, trimmed]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (blurTimerRef.current != null) window.clearTimeout(blurTimerRef.current);
    };
  }, []);

  function pickSuggestion(value: string) {
    // disable suggestions until re-focus
    setIsActive(false);
    isActiveRef.current = false;

    onChangeQuery(value);
    setOpen(false);
    setActiveIdx(-1);
    inputRef.current?.blur(); // blur on pick
    // Trigger search immediately on pick
    onSubmit();
  }

  return (
    <div>
      <div className="flex gap-2 items-center flex-wrap">
        {/* wrapper must be relative */}
        <div className="relative flex-1 min-w-105">
          {/* icon inside input */}
          <Search
            size={22}
            className="text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          />

          <input
            ref={inputRef}
            className="w-full py-3 pl-12 pr-4 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={query}
            onChange={(e) => onChangeQuery(e.target.value)}
            onFocus={() => {
              setIsActive(true);
              isActiveRef.current = true;
              if (suggestions.length > 0) setOpen(true);
            }}
            onBlur={() => {
              // mark inactive immediately so async suggestions can't reopen after blur/enter
              setIsActive(false);
              isActiveRef.current = false;

              // Delay closing so click events on suggestions can fire.
              if (blurTimerRef.current != null) window.clearTimeout(blurTimerRef.current);
              blurTimerRef.current = window.setTimeout(() => setOpen(false), 120);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                if (suggestions.length === 0) return;
                e.preventDefault();
                if (!isActiveRef.current) return;
                setOpen(true);
                setActiveIdx((prev) => {
                  const next = prev + 1;
                  return next >= suggestions.length ? 0 : next;
                });
                return;
              }

              if (e.key === "ArrowUp") {
                if (suggestions.length === 0) return;
                e.preventDefault();
                if (!isActiveRef.current) return;
                setOpen(true);
                setActiveIdx((prev) => {
                  const next = prev - 1;
                  return next < 0 ? suggestions.length - 1 : next;
                });
                return;
              }

              if (e.key === "Escape") {
                if (open) {
                  e.preventDefault();
                  setOpen(false);
                  setActiveIdx(-1);
                }
                return;
              }

              if (e.key === "Enter") {
                e.preventDefault();

                // Disable suggestions until refocus + close dropdown immediately
                setIsActive(false);
                isActiveRef.current = false;
                setOpen(false);
                setActiveIdx(-1);

                // If a suggestion is selected, pick it (pickSuggestion will blur)
                if (open && activeIdx >= 0 && activeIdx < suggestions.length) {
                  pickSuggestion(suggestions[activeIdx]);
                  return;
                }

                // Otherwise blur + submit
                inputRef.current?.blur();
                if (query.trim()) {
                  onSubmit();
                }
              }
            }}
            placeholder="Search documents..."
          />

          {open && suggestions.length > 0 ? (
            <div
              className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-20"
            >
              {suggestions.map((s, idx) => (
                <div
                  key={s + idx}
                  className={`text-sm px-4 py-2.5 cursor-pointer transition-colors ${
                    idx === activeIdx ? "bg-gray-100" : "bg-white hover:bg-gray-50"
                  }`}
                  onMouseDown={(ev) => {
                    // Prevent input blur before we pick
                    ev.preventDefault();
                  }}
                  onClick={() => pickSuggestion(s)}
                  onMouseEnter={() => setActiveIdx(idx)}
                >
                  {s}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {loading ? <div className="text-sm text-gray-500 mt-2">Searching…</div> : null}
    </div>
  );
}
