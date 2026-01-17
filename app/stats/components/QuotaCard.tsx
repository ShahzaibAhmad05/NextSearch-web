// app/stats/components/QuotaCard.tsx
import { Card } from '@/components/ui';

interface QuotaCardProps {
  remaining: number;
  consumed: number;
}

export function QuotaCard({ remaining, consumed }: QuotaCardProps) {
  const total = consumed + remaining; 
  const usedPercentage = total > 0 ? (consumed / total) * 100 : 0;
  
  const getQuotaColor = () => {
    if (usedPercentage < 50) return 'bg-emerald-500';
    if (usedPercentage < 80) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  const getBarGradient = () => {
    if (usedPercentage < 50) return 'from-emerald-500 to-emerald-600';
    if (usedPercentage < 80) return 'from-amber-500 to-amber-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <Card className="border border-white/5 bg-white/2 backdrop-blur-sm" padding="lg">
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-3xl font-semibold text-white tabular-nums">{remaining.toLocaleString()}</p>
            <p className="text-xs text-slate-400 font-medium mt-1">Calls Remaining</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-semibold text-white tabular-nums">{usedPercentage.toFixed(1)}%</p>
            <p className="text-xs text-slate-400 font-medium mt-1">Used</p>
          </div>
        </div>

        {/* Progress Bar with Animation */}
        <div className="relative h-5 bg-slate-800/50 rounded-full overflow-hidden shadow-inner">
          <div 
            className={`absolute inset-y-0 left-0 bg-linear-to-r ${getBarGradient()} transition-all duration-700 ease-out rounded-full shadow-lg`}
            style={{ width: `${Math.min(usedPercentage, 100)}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
          </div>
          {/* Percentage Label inside bar if > 10% */}
          {usedPercentage > 10 && (
            <div className="absolute inset-0 flex items-center px-3">
              <span className="text-xs font-bold text-white drop-shadow-md">
                {usedPercentage.toFixed(2)}%
              </span>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="text-center">
            <p className="text-xs text-slate-400 mb-1">Total Limit</p>
            <p className="text-lg font-semibold text-white tabular-nums">{total.toLocaleString()}</p>
          </div>
          <div className="text-center border-x border-white/5">
            <p className="text-xs text-slate-400 mb-1">Consumed</p>
            <p className="text-lg font-semibold text-white tabular-nums">{consumed.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 mb-1">Remaining</p>
            <p className="text-lg font-semibold text-white tabular-nums">{remaining.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
