// components/ui/Modal.tsx
'use client';

import { type ReactNode, useEffect, useLayoutEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface ModalProps {
  /** Whether the modal is visible */
  show: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal title */
  title?: ReactNode;
  /** Modal content */
  children: ReactNode;
  /** Maximum width class */
  maxWidth?: string;
  /** Whether to prevent closing (e.g., during loading) */
  preventClose?: boolean;
}

/**
 * A modal dialog component with backdrop blur and animation.
 */
export function Modal({
  show,
  onClose,
  title,
  children,
  maxWidth = 'max-w-195',
  preventClose = false,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const wasShowingRef = useRef(false);

  // Ensure component is mounted (for Next.js SSR)
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle show/hide with animation - use layout effect to run before paint
  useLayoutEffect(() => {
    if (show) {
      setIsClosing(false);
      wasShowingRef.current = true;
    } else if (mounted && wasShowingRef.current) {
      // Only trigger closing animation if we were previously showing
      setIsClosing(true);
      // Reset isClosing after animation completes
      const timer = setTimeout(() => {
        setIsClosing(false);
        wasShowingRef.current = false;
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [show, mounted]);

  // Close with animation
  const handleClose = () => {
    if (preventClose || isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200); // Match animation duration
  };

  // Handle escape key
  useEffect(() => {
    if (!show || preventClose) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        handleClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [show, preventClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [show]);

  // Don't render if never mounted
  if (!mounted) return null;

  // Don't render if not showing and not closing
  if (!show && !isClosing) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center z-100 backdrop-blur-sm p-4",
        "bg-black/50 [data-theme='light']_&:bg-black/30",
        isClosing ? "animate-fade-out" : "animate-fade-in"
      )}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        // Close on backdrop click
        if (e.target === e.currentTarget && !preventClose) {
          handleClose();
        }
      }}
    >
      <div
        className={cn(
          'w-full max-h-[calc(100vh-2rem)] overflow-auto glass-card text-theme-primary rounded-2xl shadow-dark-lg p-4 sm:p-5',
          isClosing ? 'animate-scale-out' : 'animate-scale-in',
          maxWidth
        )}
      >
        {title && (
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="m-0 text-xl font-semibold gradient-text">{title}</h2>
            <button
              className="px-3 py-1.5 text-sm border border-theme text-theme-secondary rounded-lg hover-theme hover:border-green-500/50 hover:text-theme-primary transition-all duration-300"
              type="button"
              onClick={handleClose}
              disabled={preventClose}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}
