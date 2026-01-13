// hooks/useVisitedLinks.ts
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'nextsearch-visited-links';
const MAX_VISITED_LINKS = 100;
/** Visited links expire after 3 days (in milliseconds) */
const EXPIRATION_TIME = 3 * 24 * 60 * 60 * 1000;

interface VisitedLink {
  /** The URL that was visited */
  url: string;
  /** Timestamp when the link was last visited */
  timestamp: number;
  /** Title of the document (optional) */
  title?: string;
}

interface UseVisitedLinksReturn {
  /** Set of visited URLs for quick lookup */
  visitedUrls: Set<string>;
  /** Full list of visited links with metadata */
  visitedLinks: VisitedLink[];
  /** Check if a URL has been visited */
  isVisited: (url: string) => boolean;
  /** Mark a URL as visited */
  markVisited: (url: string, title?: string) => void;
  /** Remove a URL from visited history */
  removeVisited: (url: string) => void;
  /** Clear all visited history */
  clearHistory: () => void;
}

/**
 * Filter out expired links (older than EXPIRATION_TIME)
 */
function filterExpiredLinks(links: VisitedLink[]): VisitedLink[] {
  const now = Date.now();
  return links.filter(link => now - link.timestamp < EXPIRATION_TIME);
}

/**
 * A hook that manages visited links history in localStorage.
 * Tracks which search result links the user has clicked.
 * Links expire after 30 days.
 */
export function useVisitedLinks(): UseVisitedLinksReturn {
  const [visitedLinks, setVisitedLinks] = useState<VisitedLink[]>([]);
  const [visitedUrls, setVisitedUrls] = useState<Set<string>>(new Set());
  const hasLoadedRef = useRef(false);

  // Load from localStorage on mount and filter out expired links
  useEffect(() => {
    if (hasLoadedRef.current) return;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Filter out expired links
          const validLinks = filterExpiredLinks(parsed);
          setVisitedLinks(validLinks);
          setVisitedUrls(new Set(validLinks.map((link: VisitedLink) => link.url)));
        }
      }
    } catch {
      // Invalid data, ignore
    }
    
    hasLoadedRef.current = true;
  }, []);

  // Save to localStorage whenever history changes (but only after initial load)
  useEffect(() => {
    if (!hasLoadedRef.current) return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visitedLinks));
    } catch {
      // localStorage might be full or disabled
    }
  }, [visitedLinks]);

  const isVisited = useCallback((url: string): boolean => {
    return visitedUrls.has(url);
  }, [visitedUrls]);

  const markVisited = useCallback((url: string, title?: string) => {
    if (!url) return;

    setVisitedLinks((prev) => {
      // Remove existing entry (to update timestamp and move to top)
      const filtered = prev.filter((link) => link.url !== url);

      // Add new entry at the beginning
      const updated: VisitedLink[] = [
        { url, timestamp: Date.now(), title },
        ...filtered,
      ].slice(0, MAX_VISITED_LINKS);

      // Also update the Set synchronously
      setVisitedUrls(new Set(updated.map(link => link.url)));

      return updated;
    });
  }, []);

  const removeVisited = useCallback((url: string) => {
    setVisitedLinks((prev) => {
      const filtered = prev.filter((link) => link.url !== url);
      setVisitedUrls(new Set(filtered.map(link => link.url)));
      return filtered;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setVisitedLinks([]);
    setVisitedUrls(new Set());
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore errors
    }
  }, []);

  return {
    visitedUrls,
    visitedLinks,
    isVisited,
    markVisited,
    removeVisited,
    clearHistory,
  };
}
