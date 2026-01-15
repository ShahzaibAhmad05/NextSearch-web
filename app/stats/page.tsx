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
        <div className="glass-card p-8 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
            <p className="text-gray-300">Loading statistics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a] flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl max-w-md mx-4">
          <h1 className="text-2xl font-bold text-red-400 mb-2">Error</h1>
          <p className="text-gray-400">{error || 'Authentication required'}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const formatPercentage = (rate: number) => `${(rate * 100).toFixed(1)}%`;

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Statistics Dashboard</h1>
          <p className="text-gray-400">System metrics and performance analytics</p>
        </div>

        {/* Search Metrics */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">Search Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Total Searches"
              value={stats.total_searches.toLocaleString()}
              icon="🔍"
              color="blue"
            />
            <StatCard
              title="Cache Hits"
              value={stats.search_cache_hits.toLocaleString()}
              subtitle={`${formatPercentage(stats.search_cache_hit_rate)} hit rate`}
              icon="⚡"
              color="green"
            />
            <StatCard
              title="Cache Performance"
              value={formatPercentage(stats.search_cache_hit_rate)}
              subtitle={`${stats.total_searches - stats.search_cache_hits} cache misses`}
              icon="📊"
              color="purple"
            />
          </div>
        </div>

        {/* AI Overview Metrics */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">AI Overview Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Total Calls"
              value={stats.ai_overview_calls.toLocaleString()}
              icon="🤖"
              color="indigo"
            />
            <StatCard
              title="Cache Hits"
              value={stats.ai_overview_cache_hits.toLocaleString()}
              subtitle={`${formatPercentage(stats.ai_overview_cache_hit_rate)} hit rate`}
              icon="💾"
              color="cyan"
            />
            <StatCard
              title="Cache Performance"
              value={formatPercentage(stats.ai_overview_cache_hit_rate)}
              subtitle={`${stats.ai_overview_calls - stats.ai_overview_cache_hits} cache misses`}
              icon="📈"
              color="teal"
            />
          </div>
        </div>

        {/* AI Summary Metrics */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">AI Summary Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Total Calls"
              value={stats.ai_summary_calls.toLocaleString()}
              icon="📝"
              color="violet"
            />
            <StatCard
              title="Cache Hits"
              value={stats.ai_summary_cache_hits.toLocaleString()}
              subtitle={`${formatPercentage(stats.ai_summary_cache_hit_rate)} hit rate`}
              icon="💿"
              color="pink"
            />
            <StatCard
              title="Cache Performance"
              value={formatPercentage(stats.ai_summary_cache_hit_rate)}
              subtitle={`${stats.ai_summary_calls - stats.ai_summary_cache_hits} cache misses`}
              icon="📉"
              color="rose"
            />
          </div>
        </div>

        {/* AI API Quota */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">AI API Quota</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard
              title="API Calls Remaining"
              value={stats.ai_api_calls_remaining.toLocaleString()}
              icon="🔑"
              color="amber"
              large
            />
            <StatCard
              title="Total AI API Calls"
              value={(
                (stats.ai_overview_calls - stats.ai_overview_cache_hits) +
                (stats.ai_summary_calls - stats.ai_summary_cache_hits)
              ).toLocaleString()}
              subtitle="Actual Azure OpenAI calls"
              icon="☁️"
              color="orange"
              large
            />
          </div>
        </div>

        {/* Feedback Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">User Feedback</h2>
          <div className="grid grid-cols-1 gap-4">
            <StatCard
              title="Total Feedback"
              value={stats.total_feedback_count.toLocaleString()}
              icon="💬"
              color="emerald"
              large
            />
          </div>
        </div>

        {/* Recent Feedback */}
        {stats.last_10_feedback.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-200 mb-4">Recent Feedback</h2>
            <Card className="overflow-hidden">
              <div className="divide-y divide-gray-700/50">
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
interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: string;
  color: string;
  large?: boolean;
}

function StatCard({ title, value, subtitle, icon, color, large = false }: StatCardProps) {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
    indigo: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30',
    cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30',
    teal: 'from-teal-500/20 to-teal-600/10 border-teal-500/30',
    violet: 'from-violet-500/20 to-violet-600/10 border-violet-500/30',
    pink: 'from-pink-500/20 to-pink-600/10 border-pink-500/30',
    rose: 'from-rose-500/20 to-rose-600/10 border-rose-500/30',
    amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
    orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/30',
    emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
  };

  return (
    <Card 
      className={`bg-linear-to-br ${colorClasses[color]} border backdrop-blur-xl transition-all hover:scale-105`}
      padding={large ? 'lg' : 'md'}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className={`font-bold text-gray-100 ${large ? 'text-4xl' : 'text-3xl'} mb-1`}>{value}</p>
      {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
    </Card>
  );
}

interface FeedbackItemProps {
  feedback: FeedbackEntry;
}

function FeedbackItem({ feedback }: FeedbackItemProps) {
  const getRatingStars = (rating?: number) => {
    if (!rating) return null;
    return '⭐'.repeat(rating);
  };

  return (
    <div className="p-4 hover:bg-white/5 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-indigo-400 uppercase tracking-wide">
              {feedback.type.replace(/_/g, ' ')}
            </span>
            {feedback.rating && (
              <span className="text-sm">{getRatingStars(feedback.rating)}</span>
            )}
          </div>
          {feedback.query && (
            <p className="text-sm text-gray-300 mb-1">
              Query: <span className="font-medium">&ldquo;{feedback.query}&rdquo;</span>
            </p>
          )}
          {feedback.comment && (
            <p className="text-sm text-gray-400 italic">&ldquo;{feedback.comment}&rdquo;</p>
          )}
        </div>
        <span className="text-xs text-gray-500 ml-4 whitespace-nowrap">
          {formatDistanceToNow(new Date(feedback.timestamp))}
        </span>
      </div>
    </div>
  );
}

