// components/Footer.tsx
'use client';

import { ExternalLink } from 'lucide-react';

/**
 * Compact footer band with copyright and resource links.
 */
export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 backdrop-blur-md z-40">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Copyright */}
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} NextSearch
          </p>

          {/* Resources Links */}
          <div className="flex items-center gap-4 text-xs">
            <a 
              href="https://github.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1">
              GitHub
              <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
