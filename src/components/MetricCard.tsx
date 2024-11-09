import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, className }) => {
  return (
    <Card className={cn("bg-card shadow-md hover:shadow-lg transition-shadow", className)}>
      <CardContent className="p-6">
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
        <div className="mt-2 text-3xl font-bold text-foreground">{value}</div>
      </CardContent>
    </Card>
  );
}

export default MetricCard;