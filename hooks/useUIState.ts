// hooks/useUIState.ts
'use client';

import { useState, useCallback } from 'react';
import { useDropdown } from './useDropdown';
import type { SortOption } from '@/lib/constants';

interface UseUIStateReturn {
  showAdvanced: boolean;
  isAdvancedClosing: boolean;
  showSort: boolean;
  sortBy: SortOption;
  showNonEnglish: boolean;
  advancedRef: React.RefObject<HTMLDivElement>;
  setShowSort: (show: boolean) => void;
  setSortBy: (sort: SortOption) => void;
  setShowNonEnglish: (show: boolean) => void;
  toggleAdvanced: () => void;
  closeAdvanced: () => void;
}

export function useUIState(): UseUIStateReturn {
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('Relevancy');
  const [showNonEnglish, setShowNonEnglish] = useState(false);

  const { 
    isOpen: showAdvanced, 
    isClosing: isAdvancedClosing, 
    toggle: toggleAdvanced,
    close: closeAdvanced,
    dropdownRef: advancedRef 
  } = useDropdown({ animationDuration: 200 });

  return {
    showAdvanced,
    isAdvancedClosing,
    showSort,
    sortBy,
    showNonEnglish,
    advancedRef,
    setShowSort,
    setSortBy,
    setShowNonEnglish,
    toggleAdvanced,
    closeAdvanced,
  };
}
