import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  className = '',
  color = 'primary',
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'text-primary-500 bg-primary-50';
      case 'secondary':
        return 'text-secondary-500 bg-secondary-50';
      case 'accent':
        return 'text-accent-500 bg-accent-50';
      case 'success':
        return 'text-success-500 bg-success-50';
      case 'warning':
        return 'text-warning-500 bg-warning-50';
      case 'error':
        return 'text-error-500 bg-error-50';
      default:
        return 'text-primary-500 bg-primary-50';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-neutral-200 p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-neutral-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-neutral-800">{value}</h3>
          
          {trend && (
            <div className="flex items-center mt-2">
              <span className={trend.isPositive ? 'text-success-500' : 'text-error-500'}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-neutral-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-full ${getColorClasses()}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;