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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-5 transition-all hover:workspace-shadow group relative"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2 rounded-lg", bg)}>
          <Icon className={cn("w-5 h-5", color)} />
        </div>
        <button className="text-[var(--muted-foreground)] p-1 rounded-full hover:bg-[var(--secondary)] opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical size={16} />
        </button>
      </div>

      <div className="space-y-1">
        <p className="text-[var(--muted-foreground)] text-xs font-medium uppercase tracking-wider">{label}</p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-2xl font-normal text-[var(--foreground)] tracking-tight">{value}</h4>
          <span className={cn(
            "text-[11px] font-medium flex items-center gap-0.5",
            isPositive ? "text-[var(--success)]" : "text-[var(--error)]"
          )}>
            {isPositive ? <ArrowUpRight size={12} /> : null}
            {growth}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between">
        <span className="text-[10px] text-[var(--muted-foreground)] font-medium">Monthly Progress</span>
        <div className="w-16 h-1.5 rounded-full bg-[var(--secondary)] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: isPositive ? '70%' : '35%' }}
            transition={{ duration: 1, delay: index * 0.1 }}
            className={cn("h-full", isPositive ? "bg-[var(--success)]" : "bg-[var(--error)]")}
          />
        </div>
      </div>
    </motion.div>
  );
};
