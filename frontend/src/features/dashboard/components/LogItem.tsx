'use client';

import { Badge } from '@/components/ui';

interface LogItemProps {
  name: string;
  action: string;
  target: string;
  time: string;
  status: string;
  index: number;
}

export const LogItem = ({ name, action, target, time, status }: LogItemProps) => {
  const getStatusVariant = (s: string): 'success' | 'warning' | 'neutral' => {
    switch (s.toLowerCase()) {
      case 'approved':
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="flex items-center justify-between p-3.5 hover:bg-secondary/20 transition-colors group cursor-pointer">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center border border-border/50 text-[10px] font-bold text-muted-foreground shrink-0 group-hover:border-primary/30 transition-colors">
          {name
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-foreground truncate">{name}</span>
            <Badge
              variant={getStatusVariant(status)}
              size="sm"
              className="font-bold tracking-tight px-1.5 py-0"
            >
              {status}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
            <span>{action}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span className="truncate">{target}</span>
          </div>
        </div>
      </div>
      <div className="text-[10px] font-bold text-muted-foreground whitespace-nowrap ml-4 tabular-nums">
        {time}
      </div>
    </div>
  );
};
