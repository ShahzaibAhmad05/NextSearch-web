// components/Footer.tsx
'use client';

import Link from 'next/link';
import { Github, ExternalLink } from 'lucide-react';

/**
 * Site-wide footer with navigation links and project info.
 */
export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block text-2xl font-bold mb-3">
              <span className="gradient-text">Next</span>
              <span className="text-white">Search</span>
            </Link>
            <p className="text-gray-400 text-sm max-w-md">
              A scalable search engine implementation demonstrating core indexing 
              concepts used in modern information retrieval systems.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://github.com/allenai/cord19" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white text-sm transition-colors inline-flex items-center gap-1"
                >
                  CORD-19 Dataset
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white text-sm transition-colors inline-flex items-center gap-1"
                >
                  GitHub Repository
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a 
                  href="https://nust.edu.pk" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white text-sm transition-colors inline-flex items-center gap-1"
                >
                  NUST
                  <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} NextSearch. Built with ❤️ at NUST.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-xs">
              Powered by C++ & Next.js
            </span>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
