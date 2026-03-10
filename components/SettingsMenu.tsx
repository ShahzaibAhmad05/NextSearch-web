// components/SettingsMenu.tsx
'use client';

import { useState } from 'react';
import { Settings, History, Trash2, X, Globe } from 'lucide-react';
import { Modal } from './ui';
import { cn } from '@/lib/utils';
import { useDropdown } from '@/hooks';
import type { RecentSearch } from '@/lib/types';
import type { VisitedLink } from '@/lib/types/shared';

interface SettingsMenuProps {
  recentSearches: RecentSearch[];
  onRemoveSearch: (query: string) => void;
  onClearHistory: () => void;
  onSelectSearch?: (query: string) => void;
  visitedLinks: VisitedLink[];
  onRemoveVisited: (url: string) => void;
  onClearVisitedLinks: () => void;
}

export default function SettingsMenu({
  recentSearches,
  onRemoveSearch,
  onClearHistory,
  onSelectSearch,
  visitedLinks,
  onRemoveVisited,
  onClearVisitedLinks,
}: SettingsMenuProps) {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showSiteHistoryModal, setShowSiteHistoryModal] = useState(false);
  const { isOpen, isClosing, toggle, close, dropdownRef } = useDropdown();

  const handleHistoryClick = () => {
    close();
    setShowHistoryModal(true);
  };

  const handleSiteHistoryClick = () => {
    close();
    setShowSiteHistoryModal(true);
  };

  return (
    <>
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={toggle}
          className={cn(
            'p-1.5 sm:p-2 rounded-lg transition-all duration-300',
            'text-gray-300 hover:text-white hover:bg-white/10',
            isOpen && 'text-white bg-white/10'
          )}
          aria-label="Settings"
          aria-expanded={isOpen}
        >
          <Settings size={18} className="sm:w-5 sm:h-5" />
        </button>

        {isOpen && (
          <div className={cn(
            "absolute right-0 top-full mt-2 w-44 sm:w-48 rounded-xl shadow-dark-lg overflow-hidden z-50 bg-[#0f0f0f] border border-white/10",
            isClosing ? "animate-scale-out" : "animate-scale-in"
          )}>
            <button
              type="button"
              onClick={handleHistoryClick}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-left text-gray-300 hover:bg-green-500/20 hover:text-white transition-colors duration-200 flex items-center gap-2 sm:gap-3 border-t border-white/5"
            >
              <History size={14} className="sm:w-4 sm:h-4 text-gray-400" />
              <span>Search History</span>
            </button>
            <button
              type="button"
              onClick={handleSiteHistoryClick}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-left text-gray-300 hover:bg-green-500/20 hover:text-white transition-colors duration-200 flex items-center gap-2 sm:gap-3 border-t border-white/5"
            >
              <Globe size={14} className="sm:w-4 sm:h-4 text-gray-400" />
              <span>Site History</span>
            </button>
          </div>
        )}
      </div>

      <SearchHistoryModal
        show={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        recentSearches={recentSearches}
        onRemoveSearch={onRemoveSearch}
        onClearHistory={onClearHistory}
        onSelectSearch={onSelectSearch}
      />

      <SiteHistoryModal
        show={showSiteHistoryModal}
        onClose={() => setShowSiteHistoryModal(false)}
        visitedLinks={visitedLinks}
        onRemoveVisited={onRemoveVisited}
        onClearHistory={onClearVisitedLinks}
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Search History Modal
// ─────────────────────────────────────────────────────────────────────────────

interface SearchHistoryModalProps {
  show: boolean;
  onClose: () => void;
  recentSearches: RecentSearch[];
  onRemoveSearch: (query: string) => void;
  onClearHistory: () => void;
  onSelectSearch?: (query: string) => void;
}

function SearchHistoryModal({
  show,
  onClose,
  recentSearches,
  onRemoveSearch,
  onClearHistory,
  onSelectSearch,
}: SearchHistoryModalProps) {
  const handleClearAll = () => {
    onClearHistory();
  };

  return (
    <Modal show={show} onClose={onClose} title="Search History" maxWidth="max-w-md">
      <div className="space-y-3">
        {recentSearches.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">
            No search history yet
          </p>
        ) : (
          <>
            <div className="max-h-80 overflow-y-auto space-y-2">
              {recentSearches.map((search) => (
                <div
                  key={`${search.query}-${search.timestamp}`}
                  className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectSearch) {
                        onSelectSearch(search.query);
                        onClose();
                      }
                    }}
                    className="flex-1 min-w-0 text-left"
                  >
                    <p className="text-sm text-white truncate">{search.query}</p>
                    <p className="text-xs text-gray-500">
                      {formatTimestamp(search.timestamp)}
                      {search.resultCount !== undefined && (
                        <span> · {search.resultCount} results</span>
                      )}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveSearch(search.query)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                    aria-label={`Remove "${search.query}" from history`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Clear all button */}
            <button
              type="button"
              onClick={handleClearAll}
              className="w-full mt-4 px-4 py-2.5 text-sm text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
              <span>Clear All History</span>
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Site History Modal
// ─────────────────────────────────────────────────────────────────────────────

interface SiteHistoryModalProps {
  show: boolean;
  onClose: () => void;
  visitedLinks: VisitedLink[];
  onRemoveVisited: (url: string) => void;
  onClearHistory: () => void;
}

function SiteHistoryModal({
  show,
  onClose,
  visitedLinks,
  onRemoveVisited,
  onClearHistory,
}: SiteHistoryModalProps) {
  const handleClearAll = () => {
    onClearHistory();
  };

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
    <Modal show={show} onClose={onClose} title="Site History" maxWidth="max-w-md">
      <div className="space-y-3">
        {visitedLinks.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">
            No sites visited yet
          </p>
        ) : (
          <>
            <div className="max-h-80 overflow-y-auto space-y-2">
              {visitedLinks.map((link) => (
                <div
                  key={`${link.url}-${link.timestamp}`}
                  className="flex items-start justify-between gap-3 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-0"
                  >
                    <p className="text-sm text-white truncate">
                      {link.title || formatUrl(link.url)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTimestamp(link.timestamp)}
                      {link.title && (
                        <span className="block truncate mt-0.5">{formatUrl(link.url)}</span>
                      )}
                    </p>
                  </a>
                  <button
                    type="button"
                    onClick={() => onRemoveVisited(link.url)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                    aria-label={`Remove "${link.title || link.url}" from history`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Clear all button */}
            <button
              type="button"
              onClick={handleClearAll}
              className="w-full mt-4 px-4 py-2.5 text-sm text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 hover:border-red-500/50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
              <span>Clear All History</span>
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return new Date(timestamp).toLocaleDateString();
}
