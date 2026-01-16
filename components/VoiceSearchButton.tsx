// components/VoiceSearchButton.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceSearchButtonProps {
  /** Callback when voice input is captured */
  onVoiceResult: (text: string) => void;
  /** Whether voice search is supported */
  disabled?: boolean;
}

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

/**
 * Voice search button with speech recognition modal.
 * Uses the Web Speech API to convert speech to text.
 */
export default function VoiceSearchButton({
  onVoiceResult,
  disabled = false,
}: VoiceSearchButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Check for browser support
  useEffect(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognitionAPI);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setError('Speech recognition is not supported in this browser');
      return;
    }

    // Reset state
    setError(null);
    setTranscript('');

    const recognition = new SpeechRecognitionAPI();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      // Update display transcript
      setTranscript(finalTranscript || interimTranscript);

      // If we have a final result, trigger the search
      if (finalTranscript) {
        onVoiceResult(finalTranscript.trim());
        stopListening();
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      
      if (event.error === 'no-speech') {
        setError('No speech detected. Please try again.');
      } else if (event.error === 'audio-capture') {
        setError('No microphone found. Please check your device.');
      } else if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone access.');
      } else {
        setError('An error occurred. Please try again.');
      }
      
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (err) {
      console.error('Failed to start recognition:', err);
      setError('Failed to start voice recognition');
    }
  }, [onVoiceResult]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const handleButtonClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleModalClose = () => {
    stopListening();
    setTranscript('');
    setError(null);
  };

  if (!isSupported) {
    return null;
  }

  return (
    <>
      {/* Microphone button */}
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={disabled}
        className={cn(
          'p-3.5 rounded-full border transition-all duration-300',
          'bg-black/45 backdrop-blur-sm border-white/8',
          'hover:bg-white/10 hover:border-violet-500/50',
          'focus:outline-none focus:ring-1 focus:ring-white/10',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          isListening && 'bg-violet-500/30 border-violet-500/50'
        )}
        aria-label={isListening ? 'Stop listening' : 'Start voice search'}
      >
        {isListening ? (
          <MicOff size={22} className="text-red-400" />
        ) : (
          <Mic size={22} className="text-gray-400 hover:text-white" />
        )}
      </button>

      {/* Voice search modal */}
      {isListening && (
        <VoiceSearchModal
          transcript={transcript}
          error={error}
          onClose={handleModalClose}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

interface VoiceSearchModalProps {
  transcript: string;
  error: string | null;
  onClose: () => void;
}

/**
 * Modal overlay showing voice search status
 */
function VoiceSearchModal({ transcript, error, onClose }: VoiceSearchModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Ensure component is mounted (for Next.js SSR)
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200); // Match animation duration
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-3",
        isClosing ? "animate-fade-out" : "animate-fade-in"
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Voice search"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className={cn(
        "w-full max-w-sm text-gray-100 rounded-2xl shadow-dark-lg p-8 text-center bg-[#151526] backdrop-blur-md",
        isClosing ? "animate-scale-out" : "animate-scale-in"
      )}>
        {/* Animated microphone icon */}
        <div className="relative inline-flex items-center justify-center mb-6">
          {/* Pulsing rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-indigo-500/20 animate-ping" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-indigo-500/30 animate-pulse" />
          </div>
          
          {/* Microphone icon */}
          <div className="relative z-10 w-16 h-16 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Mic size={32} className="text-white" />
          </div>
        </div>

        {/* Status text */}
        {error ? (
          <p className="text-red-400 text-lg">{error}</p>
        ) : transcript ? (
          <div>
            <p className="text-gray-400 text-sm mb-2">Heard:</p>
            <p className="text-white text-xl font-medium">&ldquo;{transcript}&rdquo;</p>
          </div>
        ) : (
          <p className="text-white text-xl font-medium animate-pulse">
            Speak now...
          </p>
        )}

        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          className="mt-6 px-6 py-2 text-sm text-gray-300 border border-white/20 rounded-lg hover:bg-white/10 hover:border-indigo-500/50 hover:text-white transition-all duration-300"
        >
          Cancel
        </button>
      </div>
    </div>,
    document.body
  );
}
