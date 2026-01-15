// app/stats/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui';
import { getStats } from '@/lib/services/stats';
import { verifyAdmin } from '@/lib/services/admin';
import { StatsResponse, FeedbackEntry } from '@/lib/types';
import { formatDistanceToNow } from '@/lib/utils/date';

export default function StatsPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuthAndFetchStats() {
      try {
        // Verify admin authentication
        const isValid = await verifyAdmin();
        if (!isValid) {
          router.push('/');
          return;
        }
        setIsAuthenticated(true);

        // Fetch stats
        const data = await getStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load statistics');
      } finally {
        setLoading(false);
      }
    }

    checkAuthAndFetchStats();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a] flex items-center justify-center">
        <div className="glass-card p-8 rounded-lg border border-white/5">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-400 border-t-transparent"></div>
            <p className="text-sm font-medium text-slate-300">Loading statistics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a] flex items-center justify-center">
        <div className="glass-card p-8 rounded-lg border border-red-500/20 max-w-md mx-4">
          <h1 className="text-xl font-semibold text-red-400 mb-2">Error</h1>
          <p className="text-sm text-slate-400">{error || 'Authentication required'}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const formatPercentage = (rate: number) => `${(rate * 100).toFixed(1)}%`;

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-semibold text-white mb-2 tracking-tight">Analytics Dashboard</h1>
          <p className="text-sm text-slate-400">System performance metrics and insights</p>
        </div>

        {/* Search Metrics */}
        <div className="mb-10">
          <h2 className="text-lg font-medium text-slate-200 mb-5 tracking-tight">Search Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <MetricCard
              label="Total Searches"
              value={stats.total_searches.toLocaleString()}
              trend="neutral"
            />
            <MetricCard
              label="Cache Hits"
              value={stats.search_cache_hits.toLocaleString()}
              subtitle={`${formatPercentage(stats.search_cache_hit_rate)} efficiency`}
              trend="positive"
            />
            <MetricCard
              label="Cache Misses"
              value={(stats.total_searches - stats.search_cache_hits).toLocaleString()}
              subtitle={`${formatPercentage(1 - stats.search_cache_hit_rate)} miss rate`}
              trend="neutral"
            />
          </div>
        </div>

        {/* AI Overview Metrics */}
        <div className="mb-10">
          <h2 className="text-lg font-medium text-slate-200 mb-5 tracking-tight">AI Overview Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <MetricCard
              label="Total Requests"
              value={stats.ai_overview_calls.toLocaleString()}
              trend="neutral"
            />
            <MetricCard
              label="Cached Responses"
              value={stats.ai_overview_cache_hits.toLocaleString()}
              subtitle={`${formatPercentage(stats.ai_overview_cache_hit_rate)} efficiency`}
              trend="positive"
            />
            <MetricCard
              label="API Calls"
              value={(stats.ai_overview_calls - stats.ai_overview_cache_hits).toLocaleString()}
              subtitle="Actual OpenAI requests"
              trend="neutral"
            />
          </div>
        </div>

        {/* AI Summary Metrics */}
        <div className="mb-10">
          <h2 className="text-lg font-medium text-slate-200 mb-5 tracking-tight">AI Summary Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <MetricCard
              label="Total Requests"
              value={stats.ai_summary_calls.toLocaleString()}
              trend="neutral"
            />
            <MetricCard
              label="Cached Responses"
              value={stats.ai_summary_cache_hits.toLocaleString()}
              subtitle={`${formatPercentage(stats.ai_summary_cache_hit_rate)} efficiency`}
              trend="positive"
            />
            <MetricCard
              label="API Calls"
              value={(stats.ai_summary_calls - stats.ai_summary_cache_hits).toLocaleString()}
              subtitle="Actual OpenAI requests"
              trend="neutral"
            />
          </div>
        </div>

        {/* AI API Quota */}
        <div className="mb-10">
          <h2 className="text-lg font-medium text-slate-200 mb-5 tracking-tight">API Quota Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <MetricCard
              label="Remaining Quota"
              value={stats.ai_api_calls_remaining.toLocaleString()}
              subtitle="Available API calls"
              trend="positive"
              large
            />
            <MetricCard
              label="Total Consumed"
              value={(
                (stats.ai_overview_calls - stats.ai_overview_cache_hits) +
                (stats.ai_summary_calls - stats.ai_summary_cache_hits)
              ).toLocaleString()}
              subtitle="Azure OpenAI API calls made"
              trend="neutral"
              large
            />
          </div>
        </div>

        {/* Feedback Section */}
        <div className="mb-10">
          <h2 className="text-lg font-medium text-slate-200 mb-5 tracking-tight">User Feedback</h2>
          <MetricCard
            label="Total Feedback Submissions"
            value={stats.total_feedback_count.toLocaleString()}
            trend="positive"
            large
          />
        </div>

        {/* Recent Feedback */}
        {stats.last_10_feedback.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-medium text-slate-200 mb-5 tracking-tight">Recent Feedback Entries</h2>
            <Card className="border border-white/5 overflow-hidden bg-slate-900/20 backdrop-blur-sm" padding="none">
              <div className="divide-y divide-white/5">
                {stats.last_10_feedback.map((feedback, idx) => (
                  <FeedbackItem key={idx} feedback={feedback} />
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper Components
interface MetricCardProps {
  label: string;
  value: string;
  subtitle?: string;
  trend?: 'positive' | 'negative' | 'neutral';
  large?: boolean;
}

function MetricCard({ label, value, subtitle, trend = 'neutral', large = false }: MetricCardProps) {
  const trendColors = {
    positive: 'border-emerald-500/20 bg-emerald-500/5',
    negative: 'border-red-500/20 bg-red-500/5',
    neutral: 'border-white/5 bg-white/[0.02]',
  };

  return (
    <Card 
      className={`border backdrop-blur-sm ${trendColors[trend]} transition-all hover:border-white/10`}
      padding={large ? 'lg' : 'md'}
    >
      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
        <p className={`font-semibold text-white tabular-nums ${large ? 'text-4xl' : 'text-3xl'}`}>
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
        )}
      </div>
    </Card>
  );
}

interface FeedbackItemProps {
  feedback: FeedbackEntry;
}

function FeedbackItem({ feedback }: FeedbackItemProps) {
  return (
    <div className="p-5 hover:bg-white/[0.02] transition-colors">
      <div className="flex items-start justify-between gap-4 mb-3">
        <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded text-xs font-medium text-indigo-300 uppercase tracking-wide">
          {feedback.type}
        </span>
        <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
          {formatDistanceToNow(new Date(feedback.timestamp))}
        </span>
      </div>
      
      <div className="space-y-2.5">
        <div>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1">Message:</span>
          <p className="text-sm text-slate-200 leading-relaxed">{feedback.message}</p>
        </div>
        
        {feedback.email && (
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1">Email:</span>
            <p className="text-sm text-slate-300 font-medium">{feedback.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}

