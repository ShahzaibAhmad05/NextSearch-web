// src/hooks/useClickOutside.ts

import React, { useEffect, useRef } from 'react';

/**
 * A hook that fires a callback when a click occurs outside the specified element(s).
 * Useful for closing dropdowns, modals, and popovers.
 *
 * @param callback - Function to call when clicking outside
 * @param enabled - Whether the listener is active (default: true)
 * @returns A ref to attach to the element to monitor
 *
 * @example
 * const dropdownRef = useClickOutside(() => setOpen(false), isOpen);
 * return <div ref={dropdownRef}>...</div>;
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  callback: () => void,
  enabled: boolean = true
): React.RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const callbackRef = useRef(callback);

  // Keep callback ref updated
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    function handleClickOutside(event: MouseEvent) {
      const element = ref.current;
      if (!element) return;
      if (!element.contains(event.target as Node)) {
        callbackRef.current();
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        callbackRef.current();
      }
    }

    // Use mousedown for immediate feedback (before blur fires)
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [enabled]);

  return ref;
}
