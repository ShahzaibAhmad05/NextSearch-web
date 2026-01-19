// components/ServerDownPage.tsx
'use client';

import { useEffect, useState } from 'react';

/**
 * Error page displayed when the backend server is down or unavailable
 */
export default function ServerDownPage() {
  const [timestamp, setTimestamp] = useState<string>('');

  useEffect(() => {
    // Set timestamp only on client to avoid hydration mismatch
    setTimestamp(new Date().toISOString());
  }, []);

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#000000_0%,#131313_50%,#1a1a1a_100%)] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-black/40 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Icon */}
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Server is Down
            </h1>
            <p className="text-red-400 text-lg">
              service unavailable
            </p>
          </div>

          {/* Message */}
          <div className="space-y-3 text-gray-300 px-4">
            <p>
              We're sorry, but the backend is not responding at the moment. 
              This could be due to maintenance or an unexpected issue.
            </p>
            <p className="text-sm text-gray-400">
              Please notify the developer.
            </p>
          </div>

          {/* Retry Button */}
          <button
            onClick={() => window.location.reload()}
            className="mt-1 px-6 py-3 bg-red-700 hover:bg-red-800 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    </div>
  );
}
