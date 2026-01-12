// components/ui/Alert.tsx
'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type AlertVariant = 'error' | 'success' | 'warning' | 'info';

interface AlertProps {
  /** Visual variant */
  variant: AlertVariant;
  /** Alert content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

const variantClasses: Record<AlertVariant, string> = {
  error: 'bg-red-500/20 text-red-300 border-red-500/30',
  success: 'bg-green-500/20 text-green-300 border-green-500/30',
  warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  info: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
};

/**
 * An alert component for displaying status messages.
 */
export function Alert({ variant, children, className }: AlertProps) {
  return (
    <div
      className={cn(
        'p-4 border rounded-xl text-sm animate-fade-in',
        variantClasses[variant],
        className
      )}
      role="alert"
    >
      {children}
    </div>
  );
}
