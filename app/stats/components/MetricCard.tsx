// app/stats/components/MetricCard.tsx
import { Card } from '@/components/ui';

interface MetricCardProps {
  label: string;
  value: string;
  subtitle?: string;
  trend?: 'positive' | 'negative' | 'neutral';
  large?: boolean;
}

export function MetricCard({ label, value, subtitle, trend = 'neutral', large = false }: MetricCardProps) {
  const trendColors = {
    positive: 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50',
    negative: 'border-red-500/30 bg-red-500/5 hover:border-red-500/50',
    neutral: 'border-white/5 bg-white/2 hover:border-white/10',
  };
  
  const iconColors = {
    positive: 'text-emerald-400',
    negative: 'text-red-400',
    neutral: 'text-slate-400',
  };
  
  const getTrendIcon = () => {
    if (trend === 'positive') {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
        </svg>
      );
    }
    if (trend === 'negative') {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
      </svg>
    );
  };

  return (
    <Card 
      className={`border backdrop-blur-sm ${trendColors[trend]} transition-all hover:shadow-lg duration-300`}
      padding={large ? 'lg' : 'md'}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
          <span className={iconColors[trend]}>
            {getTrendIcon()}
          </span>
        </div>
        <p className={`font-bold text-white tabular-nums ${large ? 'text-5xl' : 'text-3xl'} leading-none`}>
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-slate-500"></span>
            {subtitle}
          </p>
        )}
      </div>
    </Card>
  );
}
