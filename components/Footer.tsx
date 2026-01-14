// components/Footer.tsx
'use client';

import { useEffect, useState } from 'react';
import { ArrowUp, MessageSquare, Github, Linkedin } from 'lucide-react';
import FeedbackModal from './FeedbackModal';

interface FooterProps {
  /** Whether to show the scroll-to-top button (only on post-search view) */
  showScrollToTop?: boolean;
}

/**
 * Universal footer with scroll-to-top (conditional), feedback, GitHub, LinkedIn, and copyright links.
 * Can be shown in both pre-search and post-search views.
 */
export default function Footer({ showScrollToTop = false }: FooterProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  useEffect(() => {
    if (!showScrollToTop) return;

    const handleScroll = () => {
      // Show button when scrolled down more than 300px
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showScrollToTop]);

  const scrollToTop = () => {
    // Use Lenis for smooth scrolling if available, fallback to window.scrollTo
    if (typeof window !== 'undefined' && (window as any).lenis) {
      (window as any).lenis.scrollTo(0, { duration: 1.2, immediate: false });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="mt-3 mb-8 px-3">

      {/* Footer Content - Single Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Copyright */}
        <a
          href="https://github.com/ShahzaibAhmad05/NextSearch-web/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
        >
          © {new Date().getFullYear()} NextSearch
        </a>

        {/* Right: Links */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Back to Top Button - Only shown in post-search view when scrolled */}
          {showScrollToTop && showScrollTop && (
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-linear-to-r from-indigo-600/20 to-purple-600/20 hover:from-indigo-600/30 hover:to-purple-600/30 border border-indigo-500/30 hover:border-indigo-400/50 text-gray-300 hover:text-white transition-all duration-300"
              aria-label="Scroll to top"
            >
              <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
              <span className="text-xs font-medium">Top</span>
            </button>
          )}

          {/* Give Feedback */}
          <button
            onClick={() => setIsFeedbackModalOpen(true)}
            className="group flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors duration-200"
          >
            <MessageSquare size={14} className="group-hover:scale-110 transition-transform duration-300" />
            <span>Feedback</span>
          </button>

          {/* GitHub */}
          <a
            href="https://github.com/shahzaibahmad05/NextSearch"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors duration-200"
          >
            <Github size={14} className="group-hover:rotate-12 transition-transform duration-300" />
            <span>GitHub</span>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors duration-200"
          >
            <Linkedin size={14} className="group-hover:scale-110 transition-transform duration-300" />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={isFeedbackModalOpen} 
        onClose={() => setIsFeedbackModalOpen(false)} 
      />
    </div>
  );
}
