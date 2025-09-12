import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'harvest' | 'fresh';
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  variant = 'default',
  trend = 'neutral',
  trendValue 
}: StatsCardProps) => {
  const variantStyles = {
    default: 'bg-card border-border',
    success: 'bg-gradient-to-br from-success/10 to-success/5 border-success/20',
    harvest: 'bg-gradient-to-br from-harvest/10 to-harvest/5 border-harvest/20',
    fresh: 'bg-gradient-to-br from-accent-vibrant/10 to-accent-vibrant/5 border-accent-vibrant/20',
  };

  const iconStyles = {
    default: 'text-muted-foreground',
    success: 'text-success',
    harvest: 'text-harvest',
    fresh: 'text-accent-vibrant',
  };

  const trendStyles = {
    up: 'text-success',
    down: 'text-destructive',
    neutral: 'text-muted-foreground',
  };

  return (
    <Card className={cn(
      "p-6 hover:shadow-medium transition-spring",
      variantStyles[variant]
    )}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {trendValue && (
              <p className={cn("text-xs font-medium", trendStyles[trend])}>
                {trend === 'up' ? '↗ ' : trend === 'down' ? '↘ ' : ''}
                {trendValue}
              </p>
            )}
          </div>
        </div>
        <div className={cn(
          "p-3 rounded-xl bg-background/50",
          iconStyles[variant]
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;