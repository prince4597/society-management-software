'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, LucideIcon, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  growth: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  index: number;
}

export const StatCard = ({ label, value, growth, icon: Icon, color, bg, index }: StatCardProps) => {
  const isPositive = growth.startsWith('+');

  return (
    <div className="bg-card border border-border rounded-lg p-5 shadow-sm transition-all hover:border-primary/50 group">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded bg-secondary/50 flex items-center justify-center text-primary border border-border/50">
          <Icon size={16} />
        </div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">{label}</p>
      </div>

      <div className="space-y-1">
        <h4 className="text-2xl font-bold text-foreground tracking-tight leading-none">{value}</h4>
        <div className="flex items-center gap-2 mt-2">
          <span className={cn(
            "text-[10px] font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-secondary/30 border border-border/50",
            isPositive ? "text-success" : "text-error"
          )}>
            {isPositive ? <ArrowUpRight size={10} strokeWidth={3} /> : null}
            {growth}
          </span>
          <span className="text-[10px] text-muted-foreground font-semibold">vs last month</span>
        </div>
      </div>
    </div>
  );
};
