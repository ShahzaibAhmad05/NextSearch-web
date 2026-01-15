// app/stats/components/ChartCard.tsx
import { Card } from '@/components/ui';

interface ChartCardProps {
  label: string;
  percentage: number;
  hits: number;
  misses: number;
  color: 'emerald' | 'blue' | 'violet';
}

export function ChartCard({ label, percentage, hits, misses, color }: ChartCardProps) {
  const colorClasses = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    violet: 'bg-violet-500',
  };
  
  const gradientClasses = {
    emerald: 'from-emerald-500 to-emerald-600',
    blue: 'from-blue-500 to-blue-600',
    violet: 'from-violet-500 to-violet-600',
  };
  
  const glowClasses = {
    emerald: 'shadow-emerald-500/50',
    blue: 'shadow-blue-500/50',
    violet: 'shadow-violet-500/50',
  };

  const total = hits + misses;
  const hitsPercentage = total > 0 ? (hits / total) * 100 : 0;

  return (
    <Card className="border border-white/5 bg-white/2 backdrop-blur-sm hover:border-white/10 hover:shadow-lg transition-all" padding="lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${colorClasses[color]} animate-pulse`}></div>
            <span className="text-2xl font-bold text-white tabular-nums">{(percentage * 100).toFixed(1)}%</span>
          </div>
        </div>
        
        {/* Enhanced Progress Bar with Gradient */}
        <div className="relative h-4 bg-slate-800/50 rounded-full overflow-hidden shadow-inner">
          <div 
            className={`absolute inset-y-0 left-0 bg-linear-to-r ${gradientClasses[color]} transition-all duration-700 ease-out rounded-full ${glowClasses[color]} shadow-lg`}
            style={{ width: `${hitsPercentage}%` }}
          >
            <div className="absolute inset-0 bg-white/20"></div>
          </div>
        </div>
        
        {/* Total with visual separator */}
        <div className="flex items-center justify-center gap-2 py-1">
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-slate-600 to-transparent"></div>
          <span className="text-xs text-slate-500 font-medium px-2">
            {total.toLocaleString()} total requests
          </span>
          <div className="h-px flex-1 bg-linear-to-r from-transparent via-slate-600 to-transparent"></div>
        </div>

        {/* Enhanced Legend with Icons */}
        <div className="grid grid-cols-2 gap-4 pt-1">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
            <div className={`w-4 h-4 rounded-sm ${colorClasses[color]} mt-0.5 shadow-md`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Cache Hits
              </p>
              <p className="text-lg font-bold text-white tabular-nums">{hits.toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-0.5">{hitsPercentage.toFixed(1)}% of total</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
            <div className="w-4 h-4 rounded-sm bg-slate-700 mt-0.5 shadow-md" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Cache Misses
              </p>
              <p className="text-lg font-bold text-white tabular-nums">{misses.toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-0.5">{(100 - hitsPercentage).toFixed(1)}% of total</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
