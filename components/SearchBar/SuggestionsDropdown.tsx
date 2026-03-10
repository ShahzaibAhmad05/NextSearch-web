// components/SearchBar/SuggestionsDropdown.tsx
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SuggestionItem } from '@/hooks';
import { SuggestionIcon } from './SuggestionIcon';

interface SuggestionsDropdownProps {
  suggestions: SuggestionItem[];
  activeIndex: number;
  isClosing?: boolean;
  onSelect: (value: string) => void;
  onMouseEnter: (index: number) => void;
  onDelete?: (value: string) => void;
}

export function SuggestionsDropdown({
  suggestions,
  activeIndex,
  isClosing = false,
  onSelect,
  onMouseEnter,
  onDelete,
}: SuggestionsDropdownProps) {
  return (
    <div className={cn(
      "absolute left-0 right-0 top-full rounded-b-2xl shadow-dark-lg overflow-hidden z-100 bg-[#0a0a0a] backdrop-blur-sm",
      isClosing ? "animate-scale-out" : "animate-scale-in"
    )}>
      {suggestions.map((suggestion, idx) => (
        <SuggestionItem
          key={`${suggestion.text}-${idx}`}
          suggestion={suggestion}
          index={idx}
          isActive={idx === activeIndex}
          onSelect={onSelect}
          onMouseEnter={onMouseEnter}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

interface SuggestionItemProps {
  suggestion: SuggestionItem;
  index: number;
  isActive: boolean;
  onSelect: (value: string) => void;
  onMouseEnter: (index: number) => void;
  onDelete?: (value: string) => void;
}

function SuggestionItem({
  suggestion,
  index,
  isActive,
  onSelect,
  onMouseEnter,
  onDelete,
}: SuggestionItemProps) {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent input blur before we pick
  };

  const handleClick = () => {
    onSelect(suggestion.text);
  };

  const handleMouseEnter = () => {
    onMouseEnter(index);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(suggestion.text);
  };

  return (
    <div
      className={cn(
        'group text-sm px-4 py-2 cursor-pointer transition-colors duration-200 flex items-center gap-3',
        isActive
          ? 'bg-green-500/30 text-white'
          : 'text-gray-300 hover:bg-green-500/20 hover:text-white'
      )}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
    >
      <SuggestionIcon suggestion={suggestion} />
      <span className="flex-1">{suggestion.text}</span>
      {onDelete && suggestion.isRecent && (
        <DeleteButton onDelete={handleDelete} />
      )}
    </div>
  );
}

interface DeleteButtonProps {
  onDelete: (e: React.MouseEvent) => void;
}

function DeleteButton({ onDelete }: DeleteButtonProps) {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <>
      {/* Mobile: X icon always visible */}
      <button
        className="shrink-0 p-1 rounded-full hover:bg-red-500/20 transition-colors duration-200 sm:hidden"
        onClick={onDelete}
        onMouseDown={handleMouseDown}
        aria-label="Delete suggestion"
      >
        <X size={14} className="text-gray-400 hover:text-red-400" />
      </button>
      {/* Desktop: "Delete" text on hover */}
      <button
        className="hidden sm:block shrink-0 px-2 py-1 text-xs rounded hover:bg-gray-600/30 transition-colors duration-200 opacity-0 group-hover:opacity-100"
        onClick={onDelete}
        onMouseDown={handleMouseDown}
        aria-label="Delete suggestion"
      >
        Delete
      </button>
    </>
  );
}
