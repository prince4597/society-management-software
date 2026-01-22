'use client';

import { Building2, Users, ClipboardList, TrendingUp, AlertCircle, LucideIcon, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  <div className="flex items-center justify-between p-4 bg-[var(--card)] hover:bg-[var(--secondary)] rounded-lg border border-[var(--border)] transition-colors group cursor-pointer">
    <div className="flex items-center gap-4">
      <div className={cn("p-2 rounded-lg", color)}>
        <Icon size={20} strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-[11px] text-[var(--muted-foreground)] font-medium tracking-wide uppercase">{label}</p>
        <div className="flex items-center gap-2">
          <p className="text-base font-normal text-[var(--foreground)]">{value}</p>
          {status && (
            <span className="text-[10px] px-1.5 py-0.5 bg-[var(--success-bg)] text-[var(--success)] rounded-full font-medium">
              {status}
            </span>
          )}
        </div>
      </div>
    </div>
    <div className="flex items-center gap-1 text-[var(--success)] font-medium text-xs">
      <TrendingUp size={14} />
      {trend}
    </div>
  </div>
);

export const SocietyOverview = () => {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 workspace-shadow overflow-hidden group">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-normal text-[var(--foreground)] tracking-tight">HPH Operations</h3>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Status as of Today</p>
        </div>
        <Building2 size={24} className="text-[var(--primary)]" strokeWidth={1.5} />
      </div>

      <div className="grid grid-cols-1 gap-2 relative">
        <OperationalMetric
          icon={Building2}
          label="Unit Occupancy"
          value="1,280 Units"
          status="94.2%"
          trend="8% vs LY"
          color="bg-[var(--sidebar-active)] text-[var(--sidebar-active-text)]"
        />
        <OperationalMetric
          icon={Users}
          label="Visitor Passes"
          value="18 Active"
          status="High"
          trend="+12% today"
          color="bg-[var(--warning-bg)] text-[var(--warning)]"
        />
        <OperationalMetric
          icon={ClipboardList}
          label="Maintenance"
          value="4 High Priority"
          status="Needs Action"
          trend="-2 resolved"
          color="bg-[var(--error-bg)] text-[var(--error)]"
        />

        <div className="mt-4 p-4 rounded-lg bg-[var(--warning-bg)] border border-[var(--border)] flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-[var(--warning)]" size={16} />
            <h5 className="text-sm font-medium text-[var(--error)]">System Alert</h5>
          </div>
          <p className="text-xs text-[var(--foreground)] leading-relaxed opacity-80">Fire inspection scheduled for Block C at 2:00 PM tomorrow. Please ensure access points are clear.</p>
        </div>
      </div>

      <button
        className="w-full mt-6 py-2.5 rounded border border-[var(--border)] text-[var(--primary)] hover:bg-[var(--secondary)] font-medium text-sm transition-all flex items-center justify-center gap-2"
      >
        View Full Schedule <ArrowRight size={16} />
      </button>
    </div>
  );
};
