'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui';

interface StatCardProps {
  label: string;
  value: string;
  growth: string;
  icon: LucideIcon;
  color: 'primary' | 'success' | 'warning' | 'info' | 'destructive' | string;
  index: number;
}

export const StatCard = ({ label, value, growth, icon: Icon, color, index }: StatCardProps) => {
  const isPositive = growth.startsWith('+');

  const colorMap: Record<string, string> = {
    primary: 'text-primary bg-primary/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    info: 'text-info bg-info/10',
    destructive: 'text-destructive bg-destructive/10',
  };

  const themeClass = colorMap[color] || colorMap.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -2 }}
      className="bg-card border border-border p-6 rounded-xl shadow-sm hover:border-primary/40 transition-all group"
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center border border-current/10',
            themeClass
          )}
        >
          <Icon size={20} strokeWidth={2.5} />
        </div>
        <Badge
          variant={isPositive ? 'success' : 'error'}
          size="sm"
          className="font-bold tracking-tight"
        >
          {growth}
        </Badge>
      </div>

      <div className="space-y-1">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-2">
          {label}
        </p>
        <h4 className="text-2xl font-bold text-foreground tracking-tight leading-none tabular-nums">
          {value}
        </h4>
        <div className="flex items-center gap-1.5 mt-3">
          <span className="text-[10px] text-muted-foreground font-semibold">Volume Variance</span>
          <div className="flex-1 h-[2px] bg-secondary rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full', themeClass.split(' ')[0].replace('text', 'bg'))}
              style={{ width: '40%' }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
