// components/ui/Modal.tsx
'use client';

import { type ReactNode, useEffect, useState } from 'react';
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

  // Ensure component is mounted (for Next.js SSR)
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle escape key
  useEffect(() => {
    if (!show || preventClose) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [show, onClose, preventClose]);

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

  if (!show || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center z-100 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        // Close on backdrop click
        if (e.target === e.currentTarget && !preventClose) {
          onClose();
        }
      }}
    >
      <div
        className={cn(
          'w-full max-h-[calc(100vh-24px)] overflow-auto glass-card text-gray-100 rounded-2xl shadow-dark-lg p-5 animate-scale-in',
          maxWidth
        )}
      >
        {title && (
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="m-0 text-xl font-semibold gradient-text">{title}</h2>
            <button
              className="px-3 py-1.5 text-sm border border-white/20 text-gray-300 rounded-lg hover:bg-white/10 hover:border-indigo-500/50 hover:text-white transition-all duration-300"
              type="button"
              onClick={onClose}
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
