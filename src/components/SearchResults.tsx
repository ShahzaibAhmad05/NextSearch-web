// src/components/SearchResults.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { SearchResult } from "../types";

type Props = {
  results: SearchResult[];
  /** Number of results per page (default: 10) */
  pageSize?: number;
};

export default function SearchResults({ results, pageSize = 10 }: Props) {
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement | null>(null);

  const totalPages = Math.max(1, Math.ceil(results.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  useEffect(() => {
    const el = topRef.current;
    if (!el) return;

    const fixedNav = document.querySelector(".navbar.fixed-top") as HTMLElement | null;
    const fixedNavH = fixedNav?.getBoundingClientRect().height ?? 0;

    const stickySearch = document.querySelector(".search-sticky") as HTMLElement | null;
    const stickySearchH = stickySearch?.getBoundingClientRect().height ?? 0;

    const headerOffset = 4.5 * fixedNavH + stickySearchH + 12;
    const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  }, [safePage]);

  useEffect(() => {
    setPage(1);
  }, [results]);

  const pageResults = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return results.slice(start, start + pageSize);
  }, [results, safePage, pageSize]);

  const pageItems = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  );

  const goTo = (p: number) => setPage(Math.min(Math.max(1, p), totalPages));

  if (!results.length) {
    return <div className="mt-3 text-gray-400">No results.</div>;
  }

  return (
    <div className="mt-3">
      <div ref={topRef} />

      <div className="grid gap-4">
        {pageResults.map((r, idx) => {
          const domain = r.url ? safeHostname(r.url) : null;
          const favicon = r.url ? faviconUrl(r.url) : null;

          return (
            <div
              key={r.docId}
              className="rounded-2xl card-hover animate-fade-in-up p-5"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="flex items-start gap-4">
                {favicon && (
                  <img
                    src={favicon}
                    alt=""
                    width={44}
                    height={44}
                    className="rounded-lg shrink-0 mt-0.5 ring-2 ring-white/10"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}

                <div className="grow min-w-0">
                  <div className="font-semibold text-base line-clamp-2">
                    {r.url ? (
                      <a
                        className="clean-link"
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {r.title || "(untitled)"}
                      </a>
                    ) : (
                      <span className="text-white">{r.title || "(untitled)"}</span>
                    )}
                  </div>

                  <div className="text-sm text-gray-400 mt-1.5">
                    {formatByline(r)}
                  </div>

                  {r.url && domain && (
                    <div className="mt-3">
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-view-at inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        <span>View at {domain}</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 animate-fade-in">
          <div className="flex flex-col items-center gap-3">
            <nav aria-label="Search results pages" className="w-full">
              <ul className="flex justify-center flex-wrap gap-2">
                <li>
                  <button
                    className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                      safePage === 1
                        ? "text-gray-600 cursor-not-allowed"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                    type="button"
                    onClick={() => goTo(1)}
                    disabled={safePage === 1}
                  >
                    «
                  </button>
                </li>

                <li>
                  <button
                    className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                      safePage === 1
                        ? "text-gray-600 cursor-not-allowed"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                    type="button"
                    onClick={() => goTo(safePage - 1)}
                    disabled={safePage === 1}
                  >
                    ‹
                  </button>
                </li>

                {pageItems.map((it) => (
                  <li key={`page-${it}`}>
                    <button
                      className={`min-w-10 px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                        it === safePage
                          ? "bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-glow"
                          : "text-gray-300 hover:bg-white/10 hover:text-white"
                      }`}
                      type="button"
                      onClick={() => goTo(it)}
                    >
                      {it}
                    </button>
                  </li>
                ))}

                <li>
                  <button
                    className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                      safePage === totalPages
                        ? "text-gray-600 cursor-not-allowed"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                    type="button"
                    onClick={() => goTo(safePage + 1)}
                    disabled={safePage === totalPages}
                  >
                    ›
                  </button>
                </li>

                <li>
                  <button
                    className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                      safePage === totalPages
                        ? "text-gray-600 cursor-not-allowed"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                    type="button"
                    onClick={() => goTo(totalPages)}
                    disabled={safePage === totalPages}
                  >
                    »
                  </button>
                </li>
              </ul>
            </nav>

            <div className="text-sm text-gray-400">
              Page <span className="font-semibold text-indigo-300">{safePage}</span> of{" "}
              <span className="font-semibold text-indigo-300">{totalPages}</span>
            </div>
          </div>
        </div>
      )}

      <br />
    </div>
  );
}

function formatByline(r: SearchResult) {
  const anyR = r as unknown as {
    author?: unknown;
    authors?: unknown;
    publish_time?: unknown;
  };

  const authorRaw = anyR.author ?? anyR.authors;
  const author =
    authorRaw != null && String(authorRaw).trim()
      ? String(authorRaw).trim()
      : "—";

  const dateRaw = anyR.publish_time;
  const date =
    dateRaw != null && String(dateRaw).trim()
      ? String(dateRaw).trim()
      : "";

  const yearMatch = date.match(/\b(19\d{2}|20\d{2}|21\d{2})\b/);
  return yearMatch ? `${author} (${yearMatch[1]})` : author;
}

function safeHostname(url?: string) {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function faviconUrl(url?: string) {
  if (!url) return null;
  try {
    const u = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=64`;
  } catch {
    return null;
  }
}
