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
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 border border-red-500/20">
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
              The backend service is currently unavailable
            </p>
          </div>

          {/* Message */}
          <div className="space-y-3 text-gray-300">
            <p>
              We're sorry, but the search backend is not responding at the moment. 
              This could be due to maintenance or an unexpected issue.
            </p>
            <p className="text-sm text-gray-400">
              The system performs health checks to ensure quality service. 
              Please try again in a few minutes.
            </p>
          </div>

          {/* Contact Information */}
          <div className="w-full bg-gray-700/50 rounded-lg p-6 border border-gray-600">
            <h2 className="text-lg font-semibold text-white mb-3">
              Please Notify the Developer
            </h2>
            <p className="text-gray-300 text-sm mb-4">
              If this issue persists, please contact the development team with the following information:
            </p>
            <div className="bg-gray-900/50 rounded p-4 text-left">
              <code className="text-xs text-gray-300">
                <div className="mb-1"><span className="text-red-400">Status:</span> Backend Unavailable</div>
                <div className="mb-1"><span className="text-red-400">Endpoint:</span> /nextsearch/api/health</div>
                <div><span className="text-red-400">Time:</span> {new Date().toISOString()}</div>
              </code>
            </div>
          </div>

          {/* Retry Button */}
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
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
