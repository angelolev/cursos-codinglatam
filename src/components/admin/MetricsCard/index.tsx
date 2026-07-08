interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
    period: string;
  };
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red';
}

const colorVariants = {
  blue: 'bg-sky-500/10 text-sky-400',
  green: 'bg-emerald-500/10 text-emerald-400',
  purple: 'bg-indigo-500/10 text-indigo-400',
  yellow: 'bg-amber-500/10 text-amber-400',
  red: 'bg-red-500/10 text-red-400',
};

export default function MetricsCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  color,
}: MetricsCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/20">
      <div className="flex items-center justify-between">
        <dt className="text-sm font-medium text-zinc-400 truncate">{title}</dt>
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${colorVariants[color]}`}
        >
          <div className="h-5 w-5">{icon}</div>
        </div>
      </div>
      <dd className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-semibold tabular-nums text-white">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {trend && (
          <span
            className={`flex items-center text-sm font-medium tabular-nums ${
              trend.isPositive ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            <svg
              className={`mr-0.5 h-3 w-3 ${trend.isPositive ? 'rotate-180' : ''}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.5-4.25a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
            {Math.abs(trend.value)}%
            <span className="ml-1 font-normal text-zinc-500">{trend.period}</span>
          </span>
        )}
      </dd>
      {subtitle && <dd className="mt-1 text-sm text-zinc-500">{subtitle}</dd>}
    </div>
  );
}

export function MetricsGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {children}
    </div>
  );
}
