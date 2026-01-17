// app/stats/components/FeedbackCard.tsx
import { Card } from '@/components/ui';
import { formatDistanceToNow } from '@/lib/utils/date';
import type { FeedbackEntry } from '@/lib/types/stats';

interface FeedbackCardProps {
  feedback: FeedbackEntry;
  index: number;
}

export function FeedbackCard({ feedback, index }: FeedbackCardProps) {
  const isReplyable = feedback.type === 'replyable';
  
  return (
    <Card className={`border backdrop-blur-sm hover:shadow-lg transition-all duration-300 ${
      isReplyable 
        ? 'border-green-500/30 bg-green-500/5 hover:border-green-500/50' 
        : 'border-white/5 bg-white/2 hover:border-white/10'
    }`} padding="lg">
      <div className="flex items-start gap-4">
        {/* Enhanced Avatar */}
        <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${
          isReplyable 
            ? 'bg-linear-to-br from-green-500/30 to-green-700/30 text-green-200 border-2 border-green-400/50' 
            : 'bg-linear-to-br from-slate-700/50 to-slate-800/50 text-slate-300 border-2 border-slate-600/30'
        }`}>
          {isReplyable && feedback.email ? (
            <span className="text-lg">{feedback.email[0].toUpperCase()}</span>
          ) : (
            <span className="text-sm">#{index + 1}</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${
                isReplyable 
                  ? 'bg-linear-to-r from-green-500/20 to-green-700/20 text-green-300 border border-green-400/30' 
                  : 'bg-slate-700/50 text-slate-300 border border-slate-600/30'
              }`}>
                {feedback.type}
              </span>
              {isReplyable && (
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="whitespace-nowrap">
                {formatDistanceToNow(new Date(feedback.timestamp))}
              </span>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg mb-3 ${
            isReplyable ? 'bg-slate-800/40 border border-green-500/10' : 'bg-slate-800/30 border border-slate-700/30'
          }`}>
            <p className="text-sm text-slate-200 leading-relaxed wrap-break-word">
              {feedback.message}
            </p>
          </div>
          
          {feedback.email && (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              isReplyable ? 'bg-green-500/10 border border-green-500/20' : 'bg-slate-800/50 border border-slate-700/30'
            }`}>
              <svg className={`w-4 h-4 ${isReplyable ? 'text-green-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className={`text-xs font-medium truncate ${
                isReplyable ? 'text-green-300' : 'text-slate-400'
              }`}>
                {feedback.email}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
