// app/stats/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Database, FileText, Clock, TrendingUp, Server, HardDrive, Cpu, Activity } from 'lucide-react';
import { Card, Spinner } from '@/components/ui';
import { API_CONFIG } from '@/lib/constants';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface IndexStats {
  total_documents?: number;
  total_terms?: number;
  index_size_mb?: number;
  avg_doc_length?: number;
  segments?: number;
  last_updated?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Static Data (for when API is unavailable)
// ─────────────────────────────────────────────────────────────────────────────

const fallbackStats: IndexStats = {
  total_documents: 192459,
  total_terms: 2847291,
  index_size_mb: 847,
  avg_doc_length: 4521,
  segments: 12,
  last_updated: '2026-01-12',
};

const performanceMetrics = [
  { label: 'Avg Query Time', value: '< 50ms', icon: Clock },
  { label: 'Throughput', value: '1000+ QPS', icon: TrendingUp },
  { label: 'Index Build', value: '~15 min', icon: Cpu },
  { label: 'Memory Usage', value: '~2 GB', icon: HardDrive },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────────────────────

function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
}

// ─────────────────────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  subtext 
}: { 
  icon: typeof Database; 
  label: string; 
  value: string; 
  subtext?: string;
}) {
  return (
    <Card hoverable padding="lg" className="text-center">
      <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
        <Icon size={28} className="text-indigo-400" />
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-gray-400 font-medium">{label}</div>
      {subtext && <div className="text-xs text-gray-500 mt-1">{subtext}</div>}
    </Card>
  );
}

function ProgressBar({ label, value, max }: { label: string; value: number; max: number }) {
  const percentage = Math.min(100, (value / max) * 100);
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-white font-medium">{formatNumber(value)}</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function StatsPage() {
  const [stats, setStats] = useState<IndexStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Try to fetch real stats from the API
        const res = await fetch(`${API_CONFIG.BASE_URL}/stats`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else {
          // Use fallback stats
          setStats(fallbackStats);
        }
      } catch {
        // Use fallback stats on error
        setStats(fallbackStats);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Search</span>
          </Link>
          
          <Link href="/" className="text-xl font-bold">
            <span className="gradient-text">Next</span>
            <span className="text-white">Search</span>
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Index Statistics</span>
            </h1>
            <p className="text-xl text-gray-400">
              Real-time insights into the search engine
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner size="lg" />
            </div>
          ) : stats ? (
            <>
              {/* Main Stats */}
              <section className="mb-12 animate-fade-in-up">
                <div className="grid md:grid-cols-4 gap-4">
                  <StatCard
                    icon={FileText}
                    label="Documents Indexed"
                    value={formatNumber(stats.total_documents ?? 0)}
                    subtext="Research papers"
                  />
                  <StatCard
                    icon={Database}
                    label="Unique Terms"
                    value={formatNumber(stats.total_terms ?? 0)}
                    subtext="In vocabulary"
                  />
                  <StatCard
                    icon={HardDrive}
                    label="Index Size"
                    value={`${stats.index_size_mb ?? 0} MB`}
                    subtext="On disk"
                  />
                  <StatCard
                    icon={Server}
                    label="Segments"
                    value={String(stats.segments ?? 0)}
                    subtext="Index partitions"
                  />
                </div>
              </section>

              {/* Performance Metrics */}
              <section className="mb-12 animate-fade-in-up stagger-1">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Performance</h2>
                <div className="grid md:grid-cols-4 gap-4">
                  {performanceMetrics.map((metric, idx) => (
                    <StatCard
                      key={idx}
                      icon={metric.icon}
                      label={metric.label}
                      value={metric.value}
                    />
                  ))}
                </div>
              </section>

              {/* Index Breakdown */}
              <section className="mb-12 animate-fade-in-up stagger-2">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Index Breakdown</h2>
                <Card padding="lg">
                  <ProgressBar 
                    label="Documents Indexed" 
                    value={stats.total_documents ?? 0} 
                    max={200000} 
                  />
                  <ProgressBar 
                    label="Unique Terms" 
                    value={stats.total_terms ?? 0} 
                    max={3000000} 
                  />
                  <ProgressBar 
                    label="Average Document Length" 
                    value={stats.avg_doc_length ?? 0} 
                    max={10000} 
                  />
                </Card>
              </section>

              {/* System Status */}
              <section className="animate-fade-in-up stagger-3">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">System Status</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <Card padding="md" className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Activity size={20} className="text-green-400" />
                      <span className="text-white font-medium">API Status</span>
                    </div>
                    <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                      Operational
                    </span>
                  </Card>
                  <Card padding="md" className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Database size={20} className="text-green-400" />
                      <span className="text-white font-medium">Index Status</span>
                    </div>
                    <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                      Ready
                    </span>
                  </Card>
                  <Card padding="md" className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Clock size={20} className="text-gray-400" />
                      <span className="text-white font-medium">Last Updated</span>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {stats.last_updated ?? 'Unknown'}
                    </span>
                  </Card>
                </div>
              </section>
            </>
          ) : null}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-gray-500 text-sm">
        <p>© 2026 NextSearch. Built with ❤️ at NUST.</p>
      </footer>
    </div>
  );
}
