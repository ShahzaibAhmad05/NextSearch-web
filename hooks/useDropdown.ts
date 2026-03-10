// hooks/useDropdown.ts
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseDropdownOptions {
  /** Animation duration in ms */
  animationDuration?: number;
  /** Whether dropdown is initially open */
  initialOpen?: boolean;
}

interface UseDropdownReturn {
  /** Whether dropdown is open */
  isOpen: boolean;
  /** Whether dropdown is closing (for animation) */
  isClosing: boolean;
  /** Open the dropdown */
  open: () => void;
  /** Close the dropdown with animation */
  close: () => void;
  /** Toggle dropdown state */
  toggle: () => void;
  /** Ref to attach to dropdown container */
  dropdownRef: React.RefObject<HTMLDivElement>;
}

/**
 * Reusable hook for managing dropdown state with animations
 * Handles opening, closing with animation delay, click outside, and escape key
 */
export function useDropdown({
  animationDuration = 200,
  initialOpen = false,
}: UseDropdownOptions = {}): UseDropdownReturn {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isClosing, setIsClosing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, animationDuration);
  }, [animationDuration]);

  const open = useCallback(() => {
    setIsOpen(true);
    setIsClosing(false);
  }, []);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, close, open]);

  // Close on click outside or escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        close();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, close]);

  return {
    isOpen,
    isClosing,
    open,
    close,
    toggle,
    dropdownRef,
  };
}
