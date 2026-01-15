// components/ui/Spinner.tsx
'use client';

import { cn } from '@/lib/utils';

interface SpinnerProps {
  /** Size of the spinner */
  size?: 'sm' | 'md' | 'lg';
  /** Color variant of the spinner */
  color?: 'indigo' | 'white';
  /** Additional CSS classes */
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-3',
} as const;

const colorClasses = {
  indigo: 'border-indigo-500',
  white: 'border-white',
} as const;

/**
 * A loading spinner component with consistent styling.
 */
export function Spinner({ size = 'md', color = 'indigo', className }: SpinnerProps) {
  return (
    <div
      className={cn(
        colorClasses[color],
        'border-t-transparent rounded-full animate-spin',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}
