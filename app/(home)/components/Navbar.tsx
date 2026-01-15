// app/(home)/components/Navbar.tsx
'use client';

import { Button } from '@/components/ui';
import { SettingsMenu } from '@/components';
import type { RecentSearch } from '../types';

interface NavbarProps {
  onAddDocument: () => void;
  isAdminActive: boolean;
  recentSearches: RecentSearch[];
  onRemoveSearch: (query: string) => void;
  onClearHistory: () => void;
}

/**
 * Fixed navigation bar with logo, actions, and settings
 */
export function Navbar({ 
  onAddDocument, 
  isAdminActive, 
  recentSearches, 
  onRemoveSearch, 
  onClearHistory 
}: NavbarProps) {
  return (
    <nav className="glass-card border-b border-white/10 fixed top-0 left-0 right-0 z-50 animate-fade-in">
      <div className="max-w-310 mx-auto px-4 py-3 flex items-center justify-between">
        <a className="font-bold text-xl text-white/90" href="/">
          <span className="gradient-text">Next</span>
          <span className="text-white">Search</span>
        </a>
        <div className="flex items-center gap-2">
          <a
            href="/about"
            className="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            About
          </a>
          <Button
            variant="secondary"
            className="px-3! py-0.5! m-0! h-auto! leading-none! inline-flex items-center"
            onClick={onAddDocument}
            disabled={!isAdminActive}
            title={!isAdminActive ? "Admin access required to add documents" : "Add document to index"}
          >
            <span className="text-2xl leading-none relative -top-px -mx-0.5 pb-1">+</span>
            <span>Index</span>
          </Button>
          <SettingsMenu
            recentSearches={recentSearches}
            onRemoveSearch={onRemoveSearch}
            onClearHistory={onClearHistory}
          />
        </div>
      </div>
    </nav>
  );
}
