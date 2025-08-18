interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  height?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'secondary';
}

export default function ProgressBar({ 
  progress, 
  className = '', 
  height = 'h-2',
  showPercentage = false,
  color = 'primary'
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  const colorClasses = {
    primary: 'bg-indigo-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    secondary: 'bg-gray-600',
  };

  return (
    <div className={`w-full ${className}`}>
      {showPercentage && (
        <div className="flex justify-between text-sm text-gray-300 mb-1">
          <span>Progreso</span>
          <span>{Math.round(clampedProgress)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-700 rounded-full ${height} overflow-hidden`}>
        <div 
          className={`${height} ${colorClasses[color]} rounded-full transition-all duration-300 ease-in-out`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}