// components/SearchBar/SuggestionIcon.tsx
import { Search, History, TrendingUp } from 'lucide-react';
import type { SuggestionItem } from '@/hooks';

const ICON_MAP: Record<string, any> = {
  TrendingUp,
};

interface SuggestionIconProps {
  suggestion: SuggestionItem;
}

export function SuggestionIcon({ suggestion }: SuggestionIconProps) {
  if (suggestion.isRecent) {
    return <History size={16} className="text-gray-400 shrink-0" />;
  }
  
  if (suggestion.isTopSearch && suggestion.icon) {
    const IconComponent = ICON_MAP[suggestion.icon] || TrendingUp;
    return <IconComponent size={16} className="text-green-700 shrink-0" />;
  }
  
  return <Search size={16} className="text-gray-400 shrink-0" />;
}
