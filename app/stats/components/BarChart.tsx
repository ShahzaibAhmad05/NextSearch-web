// app/stats/components/BarChart.tsx
import { Card } from '@/components/ui';

interface BarChartProps {
  label: string;
  data: Array<{ label: string; value: number; color: string }>;
  maxValue?: number;
}

export function BarChart({ label, data, maxValue }: BarChartProps) {
  const max = maxValue || Math.max(...data.map(d => d.value), 0);
  const hasData = data.some(item => item.value > 0);
  
  return (
    <Card className="border border-white/5 bg-white/2 backdrop-blur-sm hover:border-white/10 hover:shadow-lg transition-all" padding="lg">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
        </div>

        {/* Bar Chart */}
        <div className="space-y-4">
          {!hasData && (
            <div className="text-center text-sm text-slate-500 py-6">
              No data available yet.
            </div>
          )}
          {data.map((item, index) => {
            const percentage = max > 0 ? (item.value / max) * 100 : 0;
            const barWidth = percentage > 0 ? Math.max(percentage, 2) : 0;
            const isGradient = item.color.includes('linear-gradient');
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300 font-medium">{item.label}</span>
                  <span className="text-white font-bold tabular-nums">{item.value.toLocaleString()}</span>
                </div>
                <div className="relative h-8 bg-slate-800/50 rounded-lg overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 transition-all duration-1000 ease-out flex items-center justify-end px-3 ${isGradient ? '' : item.color}`}
                    style={{
                      width: `${barWidth}%`,
                      backgroundImage: isGradient ? item.color : undefined,
                    }}
                  >
                    {percentage > 15 && (
                      <span className="text-xs font-bold text-white drop-shadow-md">
                        {percentage.toFixed(0)}%
                      </span>
                    )}
                  </div>
                  {percentage <= 15 && percentage > 0 && (
                    <div className="absolute inset-0 flex items-center justify-start pl-2" style={{ left: `${percentage}%` }}>
                      <span className="text-xs font-bold text-slate-300">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
