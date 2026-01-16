// app/(home)/components/AdvancedPopover.tsx
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AdvancedPopoverProps {
  k: number;
  status: string;
  cached: boolean;
  showNonEnglish: boolean;
  onChangeK: (k: number) => void;
  onToggleNonEnglish: (show: boolean) => void;
  onClose: () => void;
  isClosing?: boolean;
}

/**
 * Advanced search options popover
 */
export function AdvancedPopover({ k, status, cached, showNonEnglish, onChangeK, onToggleNonEnglish, onClose, isClosing = false }: AdvancedPopoverProps) {
  return (
    <div
      className={cn(
        "absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-80 rounded-2xl shadow-dark-lg p-3 sm:p-4 z-50 bg-[#0e0e19]",
        isClosing ? "animate-scale-out" : "animate-scale-in"
      )}
      role="dialog"
      aria-label="Advanced search"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-semibold text-gray-200 pb-3">Advanced search</div>
          <div className="text-sm text-gray-400">
            Tune how many results are requested from the backend.
          </div>
        </div>

        <button
          type="button"
          className="px-2 py-1 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all duration-200"
          onClick={onClose}
          aria-label="Close advanced search"
        >
          ×
        </button>
      </div>

      {status && (
        <div className="mt-3 text-sm text-violet-300 flex items-center gap-2">
          {status}
          {cached && (
            <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full font-medium ml-auto">cached</span>
          )}
        </div>
      )}

      <hr className="my-3 border-white/10" />

      <div className="flex items-center justify-between">
        <label className="text-sm">Number of results to fetch</label>
        <span className="text-sm text-violet-300">{k}</span>
      </div>

      <div className="mt-2">
        <input
          type="range"
          className="w-full"
          min={1}
          max={100}
          step={1}
          value={k}
          onChange={(e) => onChangeK(Number(e.target.value))}
        />
      </div>

      <hr className="my-3 border-white/10" />

      <div className="flex items-center justify-between">
        <label htmlFor="show-non-english" className="text-sm text-gray-200">
          Show non-English results
        </label>
        <button
          id="show-non-english"
          type="button"
          role="switch"
          aria-checked={showNonEnglish}
          onClick={() => onToggleNonEnglish(!showNonEnglish)}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:outline-none",
            showNonEnglish ? "bg-violet-500" : "bg-gray-600"
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200",
              showNonEnglish ? "translate-x-6" : "translate-x-1"
            )}
          />
        </button>
      </div>
    </div>
  );
}
