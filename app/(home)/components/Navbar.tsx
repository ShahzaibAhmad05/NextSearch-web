// app/(home)/components/Navbar.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Wrench, Plus, BarChart3 } from 'lucide-react';
import { SettingsMenu } from '@/components';
import type { RecentSearch } from '../types';
import type { VisitedLink } from '@/lib/types/shared';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onAddDocument: () => void;
  isAdminActive: boolean;
  recentSearches: RecentSearch[];
  onRemoveSearch: (query: string) => void;
  onClearHistory: () => void;
  visitedLinks: VisitedLink[];
  onRemoveVisited: (url: string) => void;
  onClearVisitedLinks: () => void;
}

/**
 * Fixed navigation bar with logo, actions, and settings
 */
export function Navbar({ 
  onAddDocument, 
  isAdminActive, 
  recentSearches, 
  onRemoveSearch, 
  onClearHistory,
  visitedLinks,
  onRemoveVisited,
  onClearVisitedLinks,
}: NavbarProps) {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [toolsClosing, setToolsClosing] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  // Close tools dropdown with animation
  const handleCloseTools = () => {
    setToolsClosing(true);
    setTimeout(() => {
      setToolsOpen(false);
      setToolsClosing(false);
    }, 200); // Match animation duration
  };

  // Close dropdown on click outside or escape
  useEffect(() => {
    if (!toolsOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        handleCloseTools();
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        handleCloseTools();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [toolsOpen]);

  return (
    <nav className="glass-card border-b border-white/10 fixed top-0 left-0 right-0 z-50 animate-fade-in">
      <div className="max-w-310 mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
        <a className="font-bold text-lg sm:text-xl text-white/90" href="/">
          <span className="gradient-text">Next</span>
          <span className="text-gray-300">Search</span>
        </a>
        <div className="flex items-center gap-1 sm:gap-2">
          <a
            href="/about"
            className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
          >
            About
          </a>
          <div className="relative" ref={toolsRef}>
            <button
              type="button"
              onClick={() => setToolsOpen(!toolsOpen)}
              className={cn(
                'p-1.5 sm:p-2 rounded-lg transition-all duration-300',
                'text-gray-400 hover:text-white hover:bg-white/10',
                toolsOpen && 'text-white bg-white/10'
              )}
              aria-label="Tools"
              aria-expanded={toolsOpen}
            >
              <Wrench size={18} className="sm:w-5 sm:h-5" />
            </button>
            {toolsOpen && (
              <div className={cn(
                "absolute right-0 top-full mt-2 w-44 sm:w-48 rounded-xl shadow-dark-lg overflow-hidden z-50 bg-[#0e0e19] border border-violet-500/20",
                toolsClosing ? "animate-scale-out" : "animate-scale-in"
              )}>
                <button
                  type="button"
                  onClick={() => {
                    if (isAdminActive) {
                      onAddDocument();
                      handleCloseTools();
                    }
                  }}
                  disabled={!isAdminActive}
                  title={!isAdminActive ? "Admin access required" : "Add document to index"}
                  className={cn(
                    'w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-left transition-colors duration-200 flex items-center gap-2 sm:gap-3',
                    isAdminActive 
                      ? 'text-gray-300 hover:bg-violet-500/20 hover:text-white'
                      : 'text-gray-600 cursor-not-allowed'
                  )}
                >
                  <Plus size={14} className="sm:w-4 sm:h-4 text-gray-400" />
                  <span>Index</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (isAdminActive) {
                      window.location.href = '/stats';
                    }
                  }}
                  disabled={!isAdminActive}
                  title={!isAdminActive ? "Admin access required" : "View statistics"}
                  className={cn(
                    'w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-left transition-colors duration-200 flex items-center gap-2 sm:gap-3 border-t border-white/5',
                    isAdminActive 
                      ? 'text-gray-300 hover:bg-violet-500/20 hover:text-white'
                      : 'text-gray-600 cursor-not-allowed'
                  )}
                >
                  <BarChart3 size={14} className="sm:w-4 sm:h-4 text-gray-400" />
                  <span>Stats</span>
                </button>
              </div>
            )}
          </div>
          <SettingsMenu
            recentSearches={recentSearches}
            onRemoveSearch={onRemoveSearch}
            onClearHistory={onClearHistory}
            visitedLinks={visitedLinks}
            onRemoveVisited={onRemoveVisited}
            onClearVisitedLinks={onClearVisitedLinks}
          />
        </div>
      </div>
    </nav>
  );
}
