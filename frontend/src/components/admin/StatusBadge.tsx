import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant, className = '' }) => {
  const getVariantClasses = () => {
    // Auto-detect variant from status text if not provided
    const lowerStatus = status.toLowerCase();
    
    if (variant === 'success' || lowerStatus.includes('completed') || lowerStatus.includes('approved') || lowerStatus.includes('active')) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    
    if (variant === 'warning' || lowerStatus.includes('pending') || lowerStatus.includes('in progress') || lowerStatus.includes('review')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
    
    if (variant === 'danger' || lowerStatus.includes('rejected') || lowerStatus.includes('failed') || lowerStatus.includes('inactive')) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    
    if (variant === 'info') {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getVariantClasses()} ${className}`}
    >
      {status}
    </span>
  );
};

export const ProgressBadge: React.FC<{ progress: number }> = ({ progress }) => {
  const getColor = () => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-300`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-right">
        {progress}%
      </span>
    </div>
  );
};
