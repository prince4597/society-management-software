'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface LogItemProps {
  name: string;
  action: string;
  target: string;
  time: string;
  status: string;
  index: number;
}

export const LogItem = ({ name, action, target, time, status, index }: LogItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-all group cursor-pointer"
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center font-medium text-muted-foreground">
          <User size={18} strokeWidth={1.5} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 flex-1">
          <div className="sm:col-span-1">
            <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{name}</h4>
          </div>
          <div className="sm:col-span-1">
            <p className="text-sm text-muted-foreground">{action}</p>
          </div>
          <div className="sm:col-span-1 hidden lg:block">
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-border" />
              {target}
            </p>
          </div>
          <div className="sm:col-span-1 text-right sm:text-left">
            <p className="text-xs text-muted-foreground flex items-center justify-end sm:justify-start gap-1.5 font-medium">
              <Calendar size={12} className="opacity-60" />
              {time}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 ml-4">
        <div className={cn(
          "px-3 py-1 rounded-full text-[11px] font-semibold transition-all text-center min-w-[80px]",
          status === 'Approved' ? "text-success bg-success/10 border border-success/20" :
            status === 'Pending' ? "text-warning bg-warning/10 border border-warning/20" :
              "text-muted-foreground bg-secondary border border-border"
        )}>
          {status}
        </div>
        <ArrowRight size={14} className="text-border group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
      </div>
    </motion.div>
  );
};
