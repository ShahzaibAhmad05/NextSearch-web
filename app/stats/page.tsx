// app/stats/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getStats } from '@/lib/services/stats';
import { verifyAdmin } from '@/lib/services/admin';
import type { StatsResponse } from '@/lib/types/stats';
import { MetricCard, ChartCard, QuotaCard, FeedbackCard } from './components';

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

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0a0a1a] via-[#1a1a2e] to-[#0a0a1a] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to NextSearch</span>
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-semibold text-white mb-2 tracking-tight">Analytics Dashboard</h1>
          <p className="text-sm text-slate-400">System performance metrics and insights</p>
        </div>

        {/* Search Metrics */}
        <div className="mb-10">
          <h2 className="text-lg font-medium text-slate-200 mb-5 tracking-tight">Search Performance</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <MetricCard
              label="Total Searches"
              value={stats.total_searches.toLocaleString()}
              trend="neutral"
            />
            <ChartCard
              label="Cache Efficiency"
              percentage={stats.search_cache_hit_rate}
              hits={stats.search_cache_hits}
              misses={stats.total_searches - stats.search_cache_hits}
              color="emerald"
            />
          </div>
        </div>

        {/* AI Overview Metrics */}
        <div className="mb-10">
          <h2 className="text-lg font-medium text-slate-200 mb-5 tracking-tight">AI Overview Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <MetricCard
              label="Total Requests"
              value={stats.ai_overview_calls.toLocaleString()}
              trend="neutral"
            />
            <ChartCard
              label="Cache Efficiency"
              percentage={stats.ai_overview_cache_hit_rate}
              hits={stats.ai_overview_cache_hits}
              misses={stats.ai_overview_calls - stats.ai_overview_cache_hits}
              color="blue"
            />
          </div>
        </div>

        {/* AI Summary Metrics */}
        <div className="mb-10">
          <h2 className="text-lg font-medium text-slate-200 mb-5 tracking-tight">AI Summary Analytics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <MetricCard
              label="Total Requests"
              value={stats.ai_summary_calls.toLocaleString()}
              trend="neutral"
            />
            <ChartCard
              label="Cache Efficiency"
              percentage={stats.ai_summary_cache_hit_rate}
              hits={stats.ai_summary_cache_hits}
              misses={stats.ai_summary_calls - stats.ai_summary_cache_hits}
              color="violet"
            />
          </div>
        </div>

        {/* AI API Quota */}
        <div className="mb-10">
          <h2 className="text-lg font-medium text-slate-200 mb-5 tracking-tight">API Quota Management</h2>
          <QuotaCard
            remaining={stats.ai_api_calls_remaining}
            consumed={(stats.ai_overview_calls - stats.ai_overview_cache_hits) + (stats.ai_summary_calls - stats.ai_summary_cache_hits)}
          />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.last_10_feedback.map((feedback, idx) => (
                <FeedbackCard key={idx} feedback={feedback} index={idx} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

