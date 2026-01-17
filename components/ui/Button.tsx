// components/ui/Button.tsx
'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: ButtonSize;
  /** Show loading spinner */
  loading?: boolean;
  /** Icon to show before text */
  leftIcon?: ReactNode;
  /** Icon to show after text */
  rightIcon?: ReactNode;
  /** Full width button */
  fullWidth?: boolean;
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg hover:shadow-green-500/50 disabled:hover:shadow-none',
  secondary:
    'border border-green-500/30 text-gray-200 hover:bg-gradient-to-r hover:from-green-500/20 hover:to-green-600/20 hover:border-green-500/50 hover:text-white',
  ghost: 'text-gray-300 hover:bg-gradient-to-r hover:from-green-500/10 hover:to-green-600/10 hover:text-white',
  danger:
    'bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/40 text-red-300 hover:from-red-500/30 hover:to-rose-500/30 hover:border-red-500/60',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm',
  md: 'px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm',
  lg: 'px-4 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base',
};

/**
 * A versatile button component with multiple variants and states.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'secondary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Spinner size="sm" className="border-current border-t-transparent" />
        ) : (
          leftIcon
        )}
        {children}
        {rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
