// components/MaintenanceModal.tsx
'use client';

import { Modal } from './ui';
import { ExternalLink } from 'lucide-react';

interface MaintenanceModalProps {
  isOpen: boolean;
}

/**
 * Modal displayed when the backend server is down or unavailable
 * Shows maintenance message with backdrop blur
 */
export default function MaintenanceModal({ isOpen }: MaintenanceModalProps) {
  const demoVideoUrl =
    process.env.NEXT_PUBLIC_DEMO_VIDEO_URL ?? 'https://youtu.be/tvpunJ4zmCg';

  return (
    <Modal 
      show={isOpen} 
      onClose={() => {}} 
      maxWidth="max-w-xl"
      preventClose={true}
    >
      <div className="flex flex-col items-center text-center space-y-6 py-4">
        {/* Icon */}
        <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center">
          <span className="text-4xl font-bold text-black">!</span>
        </div>

        {/* Heading */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
            Maintenance Ongoing
          </h1>
        </div>

        {/* Demo CTA for reviewers when backend is unavailable */}
        <a
          href={demoVideoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-lg bg-green-700 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
        >
          Watch a Video Demo Instead
          <ExternalLink size={16} className="ml-2" />
        </a>
      </div>
    </Modal>
  );
}
