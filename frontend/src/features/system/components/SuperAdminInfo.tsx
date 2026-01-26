'use client';

import { Info, Users, ShieldAlert, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

export const SuperAdminInfo = () => {
  const requirements = [
    {
      icon: Users,
      title: 'Mandatory Availability',
      description:
        'At least one Super Admin must always be active to maintain system lineage and root-level oversight.',
      urgency: 'critical',
    },
    {
      icon: ShieldAlert,
      title: 'Access Control',
      description:
        "Super Admins hold 'God Mode' permissions. This level of access should be granted only to trusted lead engineers or infrastructure owners.",
      urgency: 'high',
    },
    {
      icon: Cpu,
      title: 'System Stability',
      description:
        'The root configuration portal (Global Config) directly impacts all production nodes. Coordinate changes before execution.',
      urgency: 'medium',
    },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm overflow-hidden group">
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
          <Info size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-lg tracking-tight text-foreground">
            Administration Guidelines
          </h3>
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">
            System Governance & Security
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {requirements.map((req, i) => (
          <div
            key={i}
            className="p-5 bg-secondary/30 border border-border/50 rounded-xl space-y-3 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 bg-card rounded-lg border border-border text-primary shadow-sm">
                <req.icon size={18} />
              </div>
              <span
                className={cn(
                  'text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider',
                  req.urgency === 'critical'
                    ? 'bg-danger/10 text-danger border-danger/20'
                    : req.urgency === 'high'
                      ? 'bg-warning/10 text-warning border-warning/20'
                      : 'bg-primary/10 text-primary border-primary/20'
                )}
              >
                {req.urgency}
              </span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground">{req.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1.5 font-medium">
                {req.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-border flex items-center justify-between relative z-10">
        <div className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          System Governance Active
        </div>
        <button className="text-[11px] font-bold text-primary hover:underline uppercase tracking-wider">
          Security Policy
        </button>
      </div>
    </div>
  );
};
