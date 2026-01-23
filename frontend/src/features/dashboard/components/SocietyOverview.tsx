'use client';

import { Building2, Users, ClipboardList, TrendingUp, AlertCircle, LucideIcon, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

const OperationalMetric = ({
  icon: Icon,
  label,
  value,
  trend,
  color,
  status
}: {
  icon: LucideIcon,
  label: string,
  value: string,
  trend: string,
  color: string,
  status?: string
}) => (
  <div className="flex items-center justify-between p-4 bg-card hover:bg-secondary/50 rounded-lg border border-border transition-colors group cursor-pointer">
    <div className="flex items-center gap-4">
      <div className={cn("p-2 rounded-lg", color)}>
        <Icon size={20} strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-[11px] text-muted-foreground font-medium tracking-wide uppercase">{label}</p>
        <div className="flex items-center gap-2">
          <p className="text-base font-semibold text-foreground">{value}</p>
          {status && (
            <span className="text-[10px] px-1.5 py-0.5 bg-success/10 text-success rounded-full font-medium">
              {status}
            </span>
          )}
        </div>
      </div>
    </div>
    <div className="flex items-center gap-1 text-success font-medium text-xs">
      <TrendingUp size={14} />
      {trend}
    </div>
  </div>
);

export const SocietyOverview = () => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 workspace-shadow overflow-hidden group">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-foreground tracking-tight">HPH Operations</h3>
          <p className="text-sm text-muted-foreground mt-1">Status as of Today</p>
        </div>
        <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center">
          <Building2 size={20} className="text-primary" strokeWidth={1.5} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 relative">
        <OperationalMetric
          icon={Building2}
          label="Unit Occupancy"
          value="1,280 Units"
          status="94.2%"
          trend="8% vs LY"
          color="bg-primary/10 text-primary"
        />
        <OperationalMetric
          icon={Users}
          label="Visitor Passes"
          value="18 Active"
          status="High"
          trend="+12% today"
          color="bg-warning/10 text-warning"
        />
        <OperationalMetric
          icon={ClipboardList}
          label="Maintenance"
          value="4 High Priority"
          status="Needs Action"
          trend="-2 resolved"
          color="bg-destructive/10 text-destructive"
        />

        <div className="mt-2 p-4 rounded-lg bg-warning/5 border border-warning/10 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-warning" size={16} />
            <h5 className="text-sm font-semibold text-warning">System Alert</h5>
          </div>
          <p className="text-xs text-foreground/80 leading-relaxed">
            Fire inspection scheduled for Block C at 2:00 PM tomorrow. Please ensure access points are clear.
          </p>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full mt-6 gap-2"
      >
        View Full Schedule <ArrowRight size={16} />
      </Button>
    </div>
  );
};
