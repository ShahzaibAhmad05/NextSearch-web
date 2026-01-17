// components/SearchFilters.tsx
'use client';

import { useState, useEffect } from 'react';
import { Filter, Calendar, User, FileType, ChevronDown, X } from 'lucide-react';
import { Button, Card } from './ui';
import { cn } from '@/lib/utils';

export interface SearchFiltersState {
  dateFrom: string;
  dateTo: string;
  authors: string;
  documentType: 'all' | 'pdf' | 'pmc';
}

interface SearchFiltersProps {
  /** Current filter state */
  filters: SearchFiltersState;
  /** Callback when filters change */
  onChange: (filters: SearchFiltersState) => void;
  /** Callback to apply filters */
  onApply: () => void;
  /** Callback to reset filters */
  onReset: () => void;
}

export const defaultFilters: SearchFiltersState = {
  dateFrom: '',
  dateTo: '',
  authors: '',
  documentType: 'all',
};

/**
 * Advanced search filters for narrowing down results.
 */
export default function SearchFilters({
  filters,
  onChange,
  onApply,
  onReset,
}: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Close on scroll
  useEffect(() => {
    if (!isExpanded) return;

    function handleScroll() {
      setIsExpanded(false);
    }

    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isExpanded]);

  const hasActiveFilters =
    filters.dateFrom !== '' ||
    filters.dateTo !== '' ||
    filters.authors !== '' ||
    filters.documentType !== 'all';

  const updateFilter = <K extends keyof SearchFiltersState>(
    key: K,
    value: SearchFiltersState[K]
  ) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="mb-4">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all',
          hasActiveFilters
            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
        )}
      >
        <Filter size={16} />
        <span>Filters</span>
        {hasActiveFilters && (
          <span className="w-2 h-2 rounded-full bg-green-400" />
        )}
        <ChevronDown
          size={16}
          className={cn('transition-transform', isExpanded && 'rotate-180')}
        />
      </button>

      {/* Filter Panel */}
      {isExpanded && (
        <Card padding="md" className="mt-3 animate-scale-in">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Date From */}
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <Calendar size={14} />
                Date From
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => updateFilter('dateFrom', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <Calendar size={14} />
                Date To
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => updateFilter('dateTo', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500"
              />
            </div>

            {/* Authors */}
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <User size={14} />
                Author
              </label>
              <input
                type="text"
                value={filters.authors}
                onChange={(e) => updateFilter('authors', e.target.value)}
                placeholder="Author name..."
                className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500"
              />
            </div>

            {/* Document Type */}
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <FileType size={14} />
                Document Type
              </label>
              <select
                value={filters.documentType}
                onChange={(e) => updateFilter('documentType', e.target.value as SearchFiltersState['documentType'])}
                className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500"
              >
                <option value="all">All Types</option>
                <option value="pdf">PDF Documents</option>
                <option value="pmc">PMC Articles</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-white/10">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                leftIcon={<X size={14} />}
              >
                Reset
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onApply();
                setIsExpanded(false);
              }}
            >
              Apply Filters
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
