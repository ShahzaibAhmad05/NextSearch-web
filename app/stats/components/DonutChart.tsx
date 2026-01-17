// app/stats/components/DonutChart.tsx
import { Card } from '@/components/ui';

interface DonutChartProps {
  label: string;
  percentage: number;
  hits: number;
  misses: number;
  color: 'emerald' | 'blue' | 'violet';
}

export function DonutChart({ label, percentage, hits, misses, color }: DonutChartProps) {
  const colorClasses = {
    emerald: { main: 'stroke-emerald-500', bg: 'stroke-emerald-500/20', text: 'text-emerald-400' },
    blue: { main: 'stroke-blue-500', bg: 'stroke-blue-500/20', text: 'text-blue-400' },
    violet: { main: 'stroke-violet-500', bg: 'stroke-violet-500/20', text: 'text-violet-400' },
  };

  const total = hits + misses;
  const hitsPercentage = total > 0 ? (hits / total) * 100 : 0;
  
  // SVG circle calculations
  const size = 160;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (hitsPercentage / 100) * circumference;

  return (
    <Card className="border border-white/5 bg-white/2 backdrop-blur-sm hover:border-white/10 hover:shadow-lg transition-all" padding="lg">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-slate-300 uppercase tracking-wider">{label}</p>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full bg-${color}-500 animate-pulse`}></div>
            <span className="text-lg font-bold text-white tabular-nums">{(percentage * 100).toFixed(1)}%</span>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="flex items-center justify-center py-4">
          <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                className={colorClasses[color].bg}
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                className={`${colorClasses[color].main} transition-all duration-1000 ease-out`}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${colorClasses[color].text} tabular-nums`}>
                {hitsPercentage.toFixed(1)}%
              </span>
              <span className="text-xs text-slate-400 mt-1">Cache Hit</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full bg-${color}-500`}></div>
              <span className="text-sm text-slate-300">Cache Hits</span>
            </div>
            <span className="text-lg font-bold text-white tabular-nums">{hits.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-600"></div>
              <span className="text-sm text-slate-300">Cache Misses</span>
            </div>
            <span className="text-lg font-bold text-white tabular-nums">{misses.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
            <span className="text-sm text-slate-300">Total Requests</span>
            <span className="text-base font-semibold text-slate-300 tabular-nums">{total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
