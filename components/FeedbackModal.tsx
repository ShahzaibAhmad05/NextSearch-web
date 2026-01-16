// components/FeedbackModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, Mail, MessageSquare, Send } from 'lucide-react';
import { Modal, Button, Input, Spinner } from './ui';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FeedbackType = 'anonymous' | 'replyable';

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('anonymous');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Clean up state when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Delay cleanup to allow modal to fully close with animation
      const timer = setTimeout(() => {
        setMessage('');
        setEmail('');
        setFeedbackType('anonymous');
        setSubmitStatus('idle');
        setErrorMessage('');
      }, 250); // Slightly longer than modal animation
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setErrorMessage('Please enter your feedback');
      return;
    }

    if (feedbackType === 'replyable' && !email.trim()) {
      setErrorMessage('Please enter your email for replyable feedback');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          email: feedbackType === 'replyable' ? email : null,
          type: feedbackType,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send feedback');
      }

      setSubmitStatus('success');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} maxWidth="max-w-md">
      <>
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="text-indigo-400" size={24} />
          <h2 className="text-xl font-semibold text-white">Send Feedback</h2>
        </div>

        {submitStatus === 'success' ? (
          <div className="py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
              <Send className="text-green-400" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Feedback Sent!</h3>
            <p className="text-gray-400">Thank you for your feedback. We appreciate it!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Feedback Type Selection */}
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                <label className="text-sm font-medium text-gray-300">
                  Feedback Type:
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFeedbackType('anonymous')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all duration-200 ${
                      feedbackType === 'anonymous'
                        ? 'border-indigo-500 bg-indigo-500/10 text-white'
                        : 'border-gray-600 bg-gray-800/50 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <MessageSquare size={14} />
                    <span>Anonymous</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFeedbackType('replyable')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all duration-200 ${
                      feedbackType === 'replyable'
                        ? 'border-indigo-500 bg-indigo-500/10 text-white'
                        : 'border-gray-600 bg-gray-800/50 text-gray-400 hover:border-gray-500'
                    }`}
                  >
                    <Mail size={14} />
                    <span>Replyable</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Email Input (only for replyable) */}
            {feedbackType === 'replyable' && (
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-gray-800/50 border-gray-600 text-white placeholder-gray-500 pl-5 pr-5 text-sm"
                  required={feedbackType === 'replyable'}
                />
              </div>
            )}

            {/* Message Input */}
            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Your Feedback
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you think..."
                rows={6}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
                required
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {errorMessage}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                onClick={onClose}
                variant="secondary"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner size="sm" color="white" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Send size={16} />
                    <span>Send Feedback</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        )}
      </>
    </Modal>
  );
}
