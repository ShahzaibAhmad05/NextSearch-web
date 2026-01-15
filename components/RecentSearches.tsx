// components/RecentSearches.tsx
'use client';

import { Clock, X, Trash2 } from 'lucide-react';
import { Card, Button } from './ui';
import type { RecentSearch } from '@/lib/types';

interface RecentSearchesProps {
  /** List of recent searches */
  searches: RecentSearch[];
  /** Callback when a search is clicked */
  onSelect: (query: string) => void;
  /** Callback when a search is removed */
  onRemove: (query: string) => void;
  /** Callback to clear all history */
  onClear: () => void;
}

/**
 * Displays a list of recent searches with the ability to re-run or remove them.
 */
export default function RecentSearches({
  searches,
  onSelect,
  onRemove,
  onClear,
}: RecentSearchesProps) {
  if (searches.length === 0) return null;

  return (
    <div className="mt-8 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-gray-400">
          <Clock size={16} />
          <span className="text-sm font-medium">Recent Searches</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          leftIcon={<Trash2 size={14} />}
          className="text-gray-500 hover:text-red-400"
        >
          Clear
        </Button>
      </div>

      <Card padding="none" className="overflow-hidden divide-y divide-white/5">
        {searches.slice(0, 5).map((search) => (
          <div
            key={search.query}
            className="flex items-center justify-between p-3 hover:bg-white/5 transition-colors group"
          >
            <button
              onClick={() => onSelect(search.query)}
              className="flex-1 text-left text-gray-300 hover:text-white transition-colors"
            >
              <span className="line-clamp-1">{search.query}</span>
              {search.resultCount !== undefined && (
                <span className="text-xs text-gray-500 ml-2">
                  ({search.resultCount} results)
                </span>
              )}
            </button>
            <button
              onClick={() => onRemove(search.query)}
              className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/10 text-gray-500 hover:text-red-400 transition-all"
              aria-label={`Remove "${search.query}" from history`}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </Card>
    </div>
  );
}
