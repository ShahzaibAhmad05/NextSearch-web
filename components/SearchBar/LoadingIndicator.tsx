// components/SearchBar/LoadingIndicator.tsx
import { Spinner } from '@/components/ui';

export function LoadingIndicator() {
  return (
    <div className="text-sm text-gray-300 bg-clip-text mt-2 flex items-center gap-2 animate-fade-in">
      <Spinner size="sm" />
      <span>Searching…</span>
    </div>
  );
}
