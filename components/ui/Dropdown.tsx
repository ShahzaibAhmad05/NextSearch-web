// components/ui/Dropdown.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface DropdownOption<T> {
  value: T;
  label: string;
}

interface DropdownProps<T> {
  /** Currently selected value */
  value: T;
  /** Available options */
  options: DropdownOption<T>[];
  /** Callback when selection changes */
  onChange: (value: T) => void;
  /** Label prefix (e.g., "Sort by") */
  label?: string;
  /** Additional button classes */
  className?: string;
}

/**
 * A dropdown select component with keyboard navigation.
 */
export function Dropdown<T extends string>({
  value,
  options,
  onChange,
  label,
  className,
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close with animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
    }, 200); // Match animation duration
  };

  // Open dropdown
  const handleOpen = () => {
    setOpen(true);
    setIsClosing(false);
  };

  // Close on click outside, escape, or scroll
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        handleClose();
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        handleClose();
      }
    }

    function handleScroll() {
      handleClose();
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [open]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        className={cn(
          'px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm border border-violet-500/30 text-gray-200 rounded-lg',
          'hover:bg-linear-to-r hover:from-violet-500/20 hover:to-fuchsia-500/20 hover:border-violet-500/50 hover:text-white',
          'transition-all duration-300 flex items-center gap-1',
          className
        )}
        type="button"
        onClick={() => open ? handleClose() : handleOpen()}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {label && <span>{label}</span>}
        <span>{selectedOption?.label ?? value}</span>
        <svg
          className="w-4 h-4 transition-transform duration-300"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div
          className={cn(
            "absolute left-0 mt-2 min-w-56 rounded-xl shadow-dark-lg z-50 overflow-hidden bg-[#0e0e19]",
            isClosing ? "animate-scale-out" : "animate-scale-in"
          )}
          role="listbox">

          {options.map((opt) => (
            <button
              key={String(opt.value)}
              className={cn(
                'w-full text-left px-4 py-2.5 text-sm transition-colors duration-200',
                opt.value === value
                  ? 'bg-violet-500/30 text-white'
                  : 'text-gray-300 hover:bg-violet-500/20 hover:text-white'
              )}
              onClick={() => {
                onChange(opt.value);
                handleClose();
              }}
              type="button"
              role="option"
              aria-selected={opt.value === value}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
