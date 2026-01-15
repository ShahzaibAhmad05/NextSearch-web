// components/SiteHistory.tsx
'use client';

import { Globe, X, Trash2, ExternalLink } from 'lucide-react';
import { Card, Button } from './ui';
import type { VisitedLink } from '@/lib/types/shared';

interface SiteHistoryProps {
  /** List of visited sites */
  visitedLinks: VisitedLink[];
  /** Callback when a site is removed */
  onRemove: (url: string) => void;
  /** Callback to clear all history */
  onClear: () => void;
}

/**
 * Displays a list of visited sites with the ability to re-visit or remove them.
 */
export default function SiteHistory({
  visitedLinks,
  onRemove,
  onClear,
}: SiteHistoryProps) {
  if (visitedLinks.length === 0) return null;

  // Format URL for display (remove protocol and limit length)
  const formatUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const display = urlObj.hostname + urlObj.pathname;
      return display.length > 50 ? display.slice(0, 47) + '...' : display;
    } catch {
      return url.length > 50 ? url.slice(0, 47) + '...' : url;
    }
  };

  return (
    <div className="mt-8 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-gray-400">
          <Globe size={16} />
          <span className="text-sm font-medium">Site History</span>
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
        {visitedLinks.slice(0, 10).map((link) => (
          <div
            key={link.url}
            className="flex items-center justify-between p-3 hover:bg-white/5 transition-colors group"
          >
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-0 flex items-start gap-2 text-left hover:text-white transition-colors"
            >
              <ExternalLink size={14} className="text-gray-500 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-gray-300 block line-clamp-1">
                  {link.title || formatUrl(link.url)}
                </span>
                {link.title && (
                  <span className="text-xs text-gray-500 block truncate">
                    {formatUrl(link.url)}
                  </span>
                )}
              </div>
            </a>
            <button
              onClick={() => onRemove(link.url)}
              className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/10 text-gray-500 hover:text-red-400 transition-all shrink-0"
              aria-label={`Remove "${link.title || link.url}" from history`}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </Card>
    </div>
  );
}
