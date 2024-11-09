import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

interface FunnelStep {
  label: string;
  value: number;
  previousValue?: number;
}

interface FunnelChartProps {
  steps: FunnelStep[];
  maxValue: number;
}

const formatPercentage = (value: number): string => {
  return `${value.toFixed(2).replace('.', ',')}%`;
};

const FunnelChart: React.FC<FunnelChartProps> = ({ steps, maxValue }) => {
  return (
    <div className="space-y-6">
      {steps.map((step, index) => (
        <div key={step.label} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{step.label}</span>
            <div className="flex items-center gap-2">
              <span className="font-medium">{step.value.toLocaleString()}</span>
              {index > 0 && (
                <div className="flex items-center gap-1.5">
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <Badge variant={step.value > 0 ? "success" : "secondary"}>
                    {formatPercentage((step.value / (step.previousValue || maxValue)) * 100)}
                  </Badge>
                </div>
              )}
            </div>
          </div>
          <Progress value={(step.value / maxValue) * 100} />
        </div>
      ))}
    </div>
  );
};

export default FunnelChart;