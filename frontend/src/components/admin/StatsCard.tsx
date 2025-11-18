import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  iconColor?: string;
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  iconColor = 'from-blue-500 to-blue-600',
  trend = 'neutral',
  subtitle
}) => {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <Card className="border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className={`w-10 h-10 bg-gradient-to-br ${iconColor} rounded-lg flex items-center justify-center shadow-md`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
        {change !== undefined && (
          <p className={`text-sm font-medium ${getTrendColor()}`}>
            {change > 0 ? '+' : ''}{change}% from last month
          </p>
        )}
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
};
