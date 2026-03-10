// components/InfoMenu.tsx
'use client';

import { useState } from 'react';
import { Info, FileText, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDropdown } from '@/hooks';
import PrivacyPolicyModal from './PrivacyPolicyModal';

export default function InfoMenu() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const { isOpen, isClosing, toggle, close, dropdownRef } = useDropdown();

  const handlePrivacyClick = () => {
    close();
    setShowPrivacyModal(true);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        className={cn(
          'p-1.5 sm:p-2 rounded-lg transition-all duration-300',
          'text-gray-300 hover:text-white hover:bg-white/10',
          isOpen && 'text-white bg-white/10'
        )}
        aria-label="Info"
        aria-expanded={isOpen}
      >
        <Info size={18} className="sm:w-5 sm:h-5" />
      </button>

      {isOpen && (
        <div className={cn(
          "absolute right-0 top-full mt-2 w-44 sm:w-48 rounded-xl shadow-dark-lg overflow-hidden z-50 bg-[#0f0f0f] border border-white/10",
          isClosing ? "animate-scale-out" : "animate-scale-in"
        )}>
          <button
            type="button"
            onClick={handlePrivacyClick}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-left text-gray-300 hover:bg-green-500/20 hover:text-white transition-colors duration-200 flex items-center gap-2 sm:gap-3 border-t border-white/5"
          >
            <ShieldCheck size={14} className="sm:w-4 sm:h-4 text-gray-400" />
            <span>Privacy Policy</span>
          </button>
          <a
            href="/about"
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-left text-gray-300 hover:bg-green-500/20 hover:text-white transition-colors duration-200 flex items-center gap-2 sm:gap-3 border-t border-white/5"
          >
            <FileText size={14} className="sm:w-4 sm:h-4 text-gray-400" />
            <span>About</span>
          </a>
        </div>
      )}

      <PrivacyPolicyModal 
        isOpen={showPrivacyModal} 
        onClose={() => setShowPrivacyModal(false)} 
      />
    </div>
  );
}
