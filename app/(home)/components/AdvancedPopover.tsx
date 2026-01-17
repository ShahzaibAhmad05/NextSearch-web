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
        "absolute mt-2 rounded-2xl shadow-dark-lg p-3 sm:p-4 z-50 bg-[#0f0f0f]",
        "left-1/2 -translate-x-1/2 w-[calc(100vw-7rem)]",
        "sm:left-auto sm:right-0 sm:translate-x-0 sm:w-80",
        isClosing ? "animate-scale-out" : "animate-scale-in"
      )}
      role="dialog"
      aria-label="Advanced search"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-semibold text-gray-200 pb-2 sm:pb-3 text-sm sm:text-base">Advanced search</div>
          <div className="text-xs sm:text-sm text-gray-400">
            Tune how many results are requested from the backend.
          </div>
        </div>

        <button
          type="button"
          className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all duration-200"
          onClick={onClose}
          aria-label="Close advanced search"
        >
          ×
        </button>
      </div>

      {status && (
        <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-300 flex items-center gap-2">
          {status}
          {cached && (
            <span className="text-[10px] sm:text-xs bg-green-500/20 text-green-300 px-1.5 sm:px-2 py-0.5 rounded-full font-medium ml-auto">cached</span>
          )}
        </div>
      )}

      <hr className="my-2 sm:my-3 border-white/10" />

      <div className="flex items-center justify-between">
        <label className="text-xs sm:text-sm">Number of results to fetch</label>
        <span className="text-xs sm:text-sm text-gray-300">{k}</span>
      </div>

      <div className="mt-1.5 sm:mt-2">
        <input
          type="range"
          className="w-full green-range"
          min={1}
          max={100}
          step={1}
          value={k}
          onChange={(e) => onChangeK(Number(e.target.value))}
          style={{
            background: `linear-gradient(to right, #16a34a 0%, #16a34a ${((k - 1) / 99) * 100}%, #4b5563 ${((k - 1) / 99) * 100}%, #4b5563 100%)`
          }}
        />
      </div>

      <hr className="my-2 sm:my-3 border-white/10" />

      <div className="flex items-center justify-between">
        <label htmlFor="show-non-english" className="text-xs sm:text-sm text-gray-200">
          Show non-English results
        </label>
        <button
          id="show-non-english"
          type="button"
          role="switch"
          aria-checked={showNonEnglish}
          onClick={() => onToggleNonEnglish(!showNonEnglish)}
          className={cn(
            "relative inline-flex h-5 sm:h-6 w-9 sm:w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:outline-none",
            showNonEnglish ? "bg-green-500" : "bg-gray-600"
          )}
        >
          <span
            className={cn(
              "inline-block h-3.5 sm:h-4 w-3.5 sm:w-4 transform rounded-full bg-white transition-transform duration-200",
              showNonEnglish ? "translate-x-5 sm:translate-x-6" : "translate-x-0.5 sm:translate-x-1"
            )}
          />
        </button>
      </div>
    </div>
  );
}
