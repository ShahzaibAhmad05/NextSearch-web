// components/MaintenanceModal.tsx
'use client';

import { Modal } from './ui';

interface MaintenanceModalProps {
  isOpen: boolean;
}

/**
 * Modal displayed when the backend server is down or unavailable
 * Shows maintenance message with backdrop blur
 */
export default function MaintenanceModal({ isOpen }: MaintenanceModalProps) {
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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Maintenance Ongoing
          </h1>
        </div>

        {/* Message */}
        <div className="text-gray-300 px-4">
          <p>
            We're sorry for the incovenience. Please check back later.
          </p>
        </div>
      </div>
    </Modal>
  );
}
