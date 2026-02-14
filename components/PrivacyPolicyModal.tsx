// components/PrivacyPolicyModal.tsx
'use client';

import { Shield, Database, Eye, Brain, MessageCircle, FileText, XCircle } from 'lucide-react';
import { Modal } from './ui';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Privacy Policy modal displaying data collection and handling practices
 */
export default function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  return (
    <Modal 
      show={isOpen} 
      onClose={onClose} 
      maxWidth="max-w-2xl"
      title={
        <div className="flex items-center gap-3">
          <Shield className="text-green-400" size={24} />
          <span>Privacy Policy</span>
        </div>
      }
    >
      <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2" data-lenis-prevent>

        {/* Data Collection Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
            <Database size={20} className="text-green-400" />
            Data Collection & Processing
          </h3>

          <div className="space-y-4 pl-4">
            {/* Search Query Data */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-300 flex items-center gap-2">
                <Eye size={16} className="text-gray-400" />
                Search Query Data
              </h4>
              <ul className="text-sm text-gray-400 space-y-1 pl-6 list-disc">
                <li><strong>What:</strong> User search queries and results</li>
                <li><strong>Purpose:</strong> Performance optimization via caching</li>
                <li><strong>Storage:</strong> Local cache files</li>
                <li><strong>Retention:</strong> Cached indefinitely until manually cleared</li>
              </ul>
            </div>

            {/* AI Feature Usage */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-300 flex items-center gap-2">
                <Brain size={16} className="text-gray-400" />
                AI Feature Usage
              </h4>
              <ul className="text-sm text-gray-400 space-y-1 pl-6 list-disc">
                <li><strong>What:</strong> Search queries sent to Azure OpenAI for AI overviews/summaries</li>
                <li><strong>Purpose:</strong> Generate AI-powered search summaries</li>
                <li><strong>Third-party:</strong> Microsoft Azure OpenAI API</li>
                <li><strong>External Processing:</strong> Query text and search results sent to Azure OpenAI</li>
              </ul>
            </div>

            {/* Usage Statistics */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-300 flex items-center gap-2">
                <FileText size={16} className="text-gray-400" />
                Usage Statistics
              </h4>
              <ul className="text-sm text-gray-400 space-y-1 pl-6 list-disc">
                <li><strong>Tracked:</strong> Total searches, cache hit rates, AI API call counts</li>
                <li><strong>Personal Data:</strong> None - aggregate metrics only</li>
              </ul>
            </div>

            {/* User Feedback */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-300 flex items-center gap-2">
                <MessageCircle size={16} className="text-gray-400" />
                User Feedback
              </h4>
              <ul className="text-sm text-gray-400 space-y-1 pl-6 list-disc">
                <li><strong>What:</strong> Optional user feedback submissions</li>
                <li><strong>Contains:</strong> Feedback content and timestamps</li>
                <li><strong>Personal Data:</strong> None collected by default</li>
              </ul>
            </div>
          </div>
        </section>

        {/* What We DON'T Collect */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
            <XCircle size={20} className="text-red-400" />
            What We DON'T Collect
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4">
            {[
              'IP addresses',
              'User accounts/authentication data',
              'Cookies or tracking pixels',
              'Personal identifying information',
              'User session data',
              'Behavioral tracking'
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-gray-400">
                <XCircle size={14} className="text-red-400 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Data Sharing */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-200">Data Sharing</h3>
          <div className="pl-4 space-y-2 text-sm text-gray-400">
            <p><strong className="text-gray-300">Azure OpenAI:</strong> Query text and search results sent for AI features (when used)</p>
            <p><strong className="text-gray-300">No other third parties:</strong> Data is not sold or shared with other parties</p>
          </div>
        </section>

        {/* User Control */}
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-200">User Control</h3>
          <ul className="text-sm text-gray-400 space-y-1 pl-6 list-disc">
            <li>All data stored locally on server</li>
            <li>Admin can clear caches manually</li>
            <li>API limits can be configured</li>
            <li>No user account required</li>
          </ul>
        </section>

        {/* Footer Note */}
        <div className="pt-4 border-t border-white/10">
          <p className="text-xs text-gray-500 italic">
            This privacy policy covers backend API data handling. Client-side data (browser storage, cookies) 
            is managed separately by your browser.
          </p>
        </div>
      </div>
    </Modal>
  );
}
