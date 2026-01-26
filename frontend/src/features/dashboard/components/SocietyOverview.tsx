'use client';

import {
  Building2,
  MapPin,
  TrendingUp,
  AlertCircle,
  LucideIcon,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Badge, Card } from '@/components/ui';
import { useSocietyProfile } from '../../societies/hooks/useSocietyProfile';
import { MOCK_FLATS } from '@/features/properties/data/mockData';
import Link from 'next/link';

const OperationalMetric = ({
  icon: Icon,
  label,
  value,
  trend,
  status,
  variant = 'neutral',
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend: string;
  status?: string;
  variant?: 'success' | 'warning' | 'error' | 'neutral' | 'info';
}) => (
  <div className="flex items-center justify-between p-3.5 bg-card/50 hover:bg-secondary/30 rounded-lg border border-border/50 transition-colors group cursor-pointer">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded bg-secondary/50 flex items-center justify-center text-muted-foreground border border-border/50 group-hover:text-primary transition-colors">
        <Icon size={14} />
      </div>
      <div>
        <p className="text-[9px] text-muted-foreground font-bold tracking-widest uppercase leading-none mb-1.5">
          {label}
        </p>
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-foreground leading-none">{value}</p>
          {status && (
            <Badge variant={variant} size="sm" className="font-bold tracking-wide">
              {status}
            </Badge>
          )}
        </div>
      </div>
    </div>
    <div
      className={cn(
        'flex items-center gap-1 font-bold text-[10px] tabular-nums px-2 py-0.5 rounded-full bg-secondary/20',
        trend.startsWith('+') || trend.includes('High') || trend.includes('Active')
          ? 'text-success'
          : 'text-muted-foreground'
      )}
    >
      {trend}
    </div>
  </div>
);

export const SocietyOverview = () => {
  const { society, isLoading } = useSocietyProfile();
  const totalUnits = MOCK_FLATS.length;

  if (isLoading) {
    return (
      <Card className="overflow-hidden bg-card/30 border-border/40 p-12 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          Hydrating Records...
        </p>
      </Card>
    );
  }

  return (
    <Card className="bg-card border border-border shadow-sm overflow-hidden group">
      <div className="p-6 border-b border-border/50 flex items-center justify-between bg-secondary/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <h3 className="text-[10px] font-bold text-foreground uppercase tracking-[0.15em] leading-none">
              Verified Property
            </h3>
          </div>
          <p className="text-sm font-bold text-foreground truncate max-w-[180px]">
            {society?.name || 'Loading data...'}
          </p>
        </div>
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20 text-primary">
          <Building2 size={20} />
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="space-y-3">
          <OperationalMetric
            icon={Building2}
            label="Registry ID"
            value={society?.code || '---'}
            status="ACTIVE"
            variant="success"
            trend="Official"
          />
          <OperationalMetric
            icon={TrendingUp}
            label="Inventory Hub"
            value={`${totalUnits} Units`}
            status="Mapped"
            variant="info"
            trend="Active"
          />
          <OperationalMetric
            icon={MapPin}
            label="Regional HQ"
            value={society?.city || '---'}
            status={society?.state}
            variant="neutral"
            trend={society?.zipCode || '---'}
          />
        </div>

        <div className="mt-6 p-4 rounded-xl bg-secondary/20 border border-border/50 flex gap-3 items-start">
          <div className="mt-0.5">
            <AlertCircle className="text-warning" size={14} strokeWidth={2.5} />
          </div>
          <div>
            <h5 className="text-[10px] font-bold text-foreground uppercase tracking-widest mb-1">
              Registered HQ
            </h5>
            <p className="text-[11px] text-muted-foreground leading-relaxed font-semibold">
              {society?.address || 'Property verification pending...'}
            </p>
          </div>
        </div>

        <Link href="/dashboard/society/profile" className="block w-full pt-2">
          <Button
            variant="outline"
            className="w-full rounded-xl gap-2 text-[10px] uppercase font-bold tracking-widest h-10 border-border hover:bg-secondary transition-all"
          >
            Access Core Profile <ArrowRight size={14} />
          </Button>
        </Link>
      </div>
    </Card>
  );
};
