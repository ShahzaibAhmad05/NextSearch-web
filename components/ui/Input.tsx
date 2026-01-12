// components/ui/Input.tsx
'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Icon to display on the left */
  leftIcon?: ReactNode;
  /** Icon to display on the right */
  rightIcon?: ReactNode;
  /** Enable glow border effect */
  glowBorder?: boolean;
  /** Error state */
  error?: boolean;
  /** Full width */
  fullWidth?: boolean;
}

/**
 * A styled input component with optional icons and glow effects.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      leftIcon,
      rightIcon,
      glowBorder = false,
      error = false,
      fullWidth = true,
      className,
      ...props
    },
    ref
  ) => {
    const hasLeftIcon = !!leftIcon;
    const hasRightIcon = !!rightIcon;

    return (
      <div
        className={cn(
          'relative',
          glowBorder && 'glow-border rounded-full',
          fullWidth && 'w-full'
        )}
      >
        {leftIcon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-gray-400">
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          className={cn(
            'w-full py-3.5 text-lg bg-black/45 backdrop-blur-sm border rounded-full text-white placeholder-gray-500',
            'focus:outline-none focus:ring-1 focus:ring-white/10 focus:border-white/15',
            'transition-all duration-300',
            hasLeftIcon ? 'pl-12' : 'pl-4',
            hasRightIcon ? 'pr-12' : 'pr-4',
            error ? 'border-red-500/50' : 'border-white/8',
            className
          )}
          {...props}
        />

        {rightIcon && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-gray-400">
            {rightIcon}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
