import { Building2, Users, ClipboardList, TrendingUp, AlertCircle, LucideIcon, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Badge, Card } from '@/components/ui';

const OperationalMetric = ({
  icon: Icon,
  label,
  value,
  trend,
  status,
  variant = 'neutral'
}: {
  icon: LucideIcon,
  label: string,
  value: string,
  trend: string,
  status?: string,
  variant?: 'success' | 'warning' | 'error' | 'neutral'
}) => (
  <div className="flex items-center justify-between p-3.5 bg-card/50 hover:bg-secondary/30 rounded-lg border border-border/50 transition-colors group cursor-pointer">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded bg-secondary/50 flex items-center justify-center text-muted-foreground border border-border/50 group-hover:text-primary transition-colors">
        <Icon size={14} />
      </div>
      <div>
        <p className="text-[9px] text-muted-foreground font-bold tracking-widest uppercase leading-none mb-1.5">{label}</p>
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-foreground leading-none">{value}</p>
          {status && (
            <Badge variant={variant as any} size="sm" className="font-bold tracking-wide">
              {status}
            </Badge>
          )}
        </div>
      </div>
    </div>
    <div className={cn(
      "flex items-center gap-1 font-bold text-[10px] tabular-nums px-2 py-0.5 rounded-full bg-secondary/20",
      trend.startsWith('+') || trend.includes('High') ? "text-success" : "text-muted-foreground"
    )}>
      {trend}
    </div>
  </div>
);

export const SocietyOverview = () => {
  return (
    <Card className="overflow-hidden bg-card/30 border-border/40">
      <div className="p-5 border-b border-border/50 flex items-center justify-between bg-secondary/5">
        <div>
          <h3 className="text-xs font-bold text-foreground uppercase tracking-[0.1em]">Management Overview</h3>
          <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">Real-time operational status</p>
        </div>
        <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center border border-primary/20">
          <Building2 size={16} className="text-primary" />
        </div>
      </div>

      <div className="p-4 space-y-2">
        <OperationalMetric
          icon={Building2}
          label="Unit Occupancy"
          value="1,280 Units"
          status="94.2%"
          variant="success"
          trend="+8% LY"
        />
        <OperationalMetric
          icon={Users}
          label="Active Visitor Load"
          value="18 Active"
          status="Peak"
          variant="warning"
          trend="+12% today"
        />
        <OperationalMetric
          icon={ClipboardList}
          label="Pending Maintenance"
          value="4 High Priority"
          status="Action Required"
          variant="error"
          trend="84% Resolve"
        />

        <div className="mt-4 p-3 rounded bg-secondary/20 border border-border/50 flex gap-3 items-start">
          <div className="mt-0.5">
            <AlertCircle className="text-amber-500" size={14} />
          </div>
          <div>
            <h5 className="text-[10px] font-bold text-foreground uppercase tracking-widest mb-1">System Advisory</h5>
            <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
              Fire inspection scheduled for <span className="text-foreground font-bold">Block C</span> tomorrow at 14:00. Ensure all access corridors are cleared.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full mt-4 gap-2 text-[10px] uppercase font-bold tracking-widest h-9 bg-secondary/10 border-border/50 hover:bg-secondary/20"
        >
          View Full schedule <ArrowRight size={14} />
        </Button>
      </div>
    </Card>
  );
};
