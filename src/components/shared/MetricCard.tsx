
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red';
}

const MetricCard = ({ title, value, icon: Icon, description, trend, color = 'blue' }: MetricCardProps) => {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    orange: 'bg-orange-500/20 text-orange-400',
    purple: 'bg-purple-500/20 text-purple-400',
    red: 'bg-red-500/20 text-red-400',
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-300">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white mb-1">{value}</div>
        {description && (
          <p className="text-xs text-gray-400">{description}</p>
        )}
        {trend && (
          <div className="flex items-center text-xs mt-1">
            <span className={trend.isPositive ? 'text-green-400' : 'text-red-400'}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
            <span className="text-gray-400 ml-1">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
