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
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    iconBg: 'bg-blue-100',
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    iconBg: 'bg-green-100',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    iconBg: 'bg-purple-100',
  },
  yellow: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-600',
    iconBg: 'bg-yellow-100',
  },
  red: {
    bg: 'bg-red-50',
    text: 'text-red-600',
    iconBg: 'bg-red-100',
  },
};

export default function MetricsCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  color,
}: MetricsCardProps) {
  const colors = colorVariants[color];

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`w-8 h-8 ${colors.iconBg} rounded-md flex items-center justify-center`}>
              <div className={`w-5 h-5 ${colors.text}`}>
                {icon}
              </div>
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </div>
                {trend && (
                  <div className="ml-2 flex items-baseline text-sm font-semibold">
                    <div className={`${trend.isPositive ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                      {trend.isPositive ? (
                        <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.5-4.25a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                            transform="rotate(180)"
                          />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.5-4.25a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      {Math.abs(trend.value)}%
                    </div>
                    <div className="text-gray-500 ml-1">
                      {trend.period}
                    </div>
                  </div>
                )}
              </dd>
              {subtitle && (
                <dd className="text-sm text-gray-600 mt-1">
                  {subtitle}
                </dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MetricsGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {children}
    </div>
  );
}