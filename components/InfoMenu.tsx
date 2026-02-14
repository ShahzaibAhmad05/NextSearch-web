// components/InfoMenu.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Info, FileText, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import PrivacyPolicyModal from './PrivacyPolicyModal';

/**
 * Info menu with dropdown for accessing informational pages.
 */
export default function InfoMenu() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownClosing, setIsDropdownClosing] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown with animation
  const handleCloseDropdown = () => {
    setIsDropdownClosing(true);
    setTimeout(() => {
      setIsDropdownOpen(false);
      setIsDropdownClosing(false);
    }, 200); // Match animation duration
  };

  // Handle privacy policy click
  const handlePrivacyClick = () => {
    handleCloseDropdown();
    setShowPrivacyModal(true);
  };

  // Close dropdown on click outside
  useEffect(() => {
    if (!isDropdownOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        handleCloseDropdown();
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        handleCloseDropdown();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={cn(
          'p-1.5 sm:p-2 rounded-lg transition-all duration-300',
          'text-gray-300 hover:text-white hover:bg-white/10',
          isDropdownOpen && 'text-white bg-white/10'
        )}
        aria-label="Info"
        aria-expanded={isDropdownOpen}
      >
        <Info size={18} className="sm:w-5 sm:h-5" />
      </button>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div className={cn(
          "absolute right-0 top-full mt-2 w-44 sm:w-48 rounded-xl shadow-dark-lg overflow-hidden z-50 bg-[#0f0f0f] border border-white/10",
          isDropdownClosing ? "animate-scale-out" : "animate-scale-in"
        )}>
          <a
            href="/about"
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-left text-gray-300 hover:bg-green-500/20 hover:text-white transition-colors duration-200 flex items-center gap-2 sm:gap-3 border-t border-white/5"
          >
            <FileText size={14} className="sm:w-4 sm:h-4 text-gray-400" />
            <span>About</span>
          </a>
          <button
            type="button"
            onClick={handlePrivacyClick}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-left text-gray-300 hover:bg-green-500/20 hover:text-white transition-colors duration-200 flex items-center gap-2 sm:gap-3 border-t border-white/5"
          >
            <ShieldCheck size={14} className="sm:w-4 sm:h-4 text-gray-400" />
            <span>Privacy Policy</span>
          </button>
        </div>
      )}

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal 
        isOpen={showPrivacyModal} 
        onClose={() => setShowPrivacyModal(false)} 
      />
    </div>
  );
}
