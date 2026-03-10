// hooks/useSuggestions/utils.ts
import type { SuggestionItem } from './types';
import { TOP_SEARCHES } from './constants';

/**
 * Merge API suggestions with recent searches, avoiding duplicates
 */
export function mergeSuggestions(
  apiSuggestions: string[],
  recentSearches: string[],
  query: string,
  minQueryLength: number,
  maxSuggestions: number
): SuggestionItem[] {
  const merged: SuggestionItem[] = [];
  const seen = new Set<string>();
  const trimmedQuery = query.trim().toLowerCase();

  // Empty query: show recent searches + top searches
  if (trimmedQuery.length === 0) {
    addRecentSearches(recentSearches, merged, seen);
    addTopSearches(merged, seen, recentSearches.length);
    return merged.slice(0, maxSuggestions);
  }

  // Query too short: no suggestions
  if (trimmedQuery.length < minQueryLength) {
    return [];
  }

  // Has query: show matching recent searches + API suggestions
  addMatchingRecentSearches(recentSearches, trimmedQuery, merged, seen);
  addApiSuggestions(apiSuggestions, merged, seen);

  return merged.slice(0, maxSuggestions);
}

function addRecentSearches(
  recentSearches: string[],
  merged: SuggestionItem[],
  seen: Set<string>
) {
  for (const recent of recentSearches) {
    const recentLower = recent.toLowerCase();
    if (!seen.has(recentLower)) {
      merged.push({ text: recent, isRecent: true });
      seen.add(recentLower);
    }
  }
}

function addTopSearches(
  merged: SuggestionItem[],
  seen: Set<string>,
  recentCount: number
) {
  if (recentCount >= 5) return;

  for (const topSearch of TOP_SEARCHES) {
    const topSearchLower = topSearch.text.toLowerCase();
    if (!seen.has(topSearchLower) && merged.length < 5) {
      merged.push({
        text: topSearch.text,
        isRecent: false,
        isTopSearch: true,
        icon: topSearch.icon,
      });
      seen.add(topSearchLower);
    }
  }
}

function addMatchingRecentSearches(
  recentSearches: string[],
  query: string,
  merged: SuggestionItem[],
  seen: Set<string>
) {
  for (const recent of recentSearches) {
    const recentLower = recent.toLowerCase();
    if (recentLower.includes(query) && !seen.has(recentLower)) {
      merged.push({ text: recent, isRecent: true });
      seen.add(recentLower);
    }
  }
}

function addApiSuggestions(
  apiSuggestions: string[],
  merged: SuggestionItem[],
  seen: Set<string>
) {
  for (const suggestion of apiSuggestions) {
    const suggestionLower = suggestion.toLowerCase();
    if (!seen.has(suggestionLower)) {
      merged.push({ text: suggestion, isRecent: false });
      seen.add(suggestionLower);
    }
  }
}
