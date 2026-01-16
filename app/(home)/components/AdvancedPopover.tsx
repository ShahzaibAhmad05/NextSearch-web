// app/(home)/components/AdvancedPopover.tsx
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AdvancedPopoverProps {
  k: number;
  status: string;
  cached: boolean;
  onChangeK: (k: number) => void;
  onClose: () => void;
  isClosing?: boolean;
}

/**
 * Advanced search options popover
 */
export function AdvancedPopover({ k, status, cached, onChangeK, onClose, isClosing = false }: AdvancedPopoverProps) {
  return (
    <div
      className={cn(
        "absolute right-0 mt-2 w-80 rounded-2xl shadow-dark-lg p-4 z-50 bg-[#151526]",
        isClosing ? "animate-scale-out" : "animate-scale-in"
      )}
      role="dialog"
      aria-label="Advanced search"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-semibold text-white">Advanced search</div>
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
        <div className="mt-3 text-sm text-indigo-300 flex items-center gap-2">
          {status}
          {cached && (
            <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full font-medium ml-auto">cached</span>
          )}
        </div>
      )}

      <hr className="my-3 border-white/10" />

      <div className="flex items-center justify-between">
        <label className="font-semibold text-sm">Number of results to fetch</label>
        <span className="text-sm text-indigo-300">{k}</span>
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
    </div>
  );
}
