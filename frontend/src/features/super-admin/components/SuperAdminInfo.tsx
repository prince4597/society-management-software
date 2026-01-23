'use client';

import { ShieldCheck, Info, Users, ShieldAlert, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const SuperAdminInfo = () => {
  const requirements = [
    {
      icon: Users,
      title: "Mandatory Availability",
      description: "At least one Super Admin must always be active to maintain system lineage and root-level oversight.",
      urgency: "critical"
    },
    {
      icon: ShieldAlert,
      title: "Access Control",
      description: "Super Admins hold 'God Mode' permissions. This level of access should be granted only to trusted lead engineers or infrastructure owners.",
      urgency: "high"
    },
    {
      icon: Cpu,
      title: "System Stability",
      description: "The root configuration portal (Global Config) directly impacts all production nodes. Coordinate changes before execution.",
      urgency: "medium"
    }
  ];

  return (
    <div className="bg-card border border-border/60 rounded-2xl p-6 workspace-shadow relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] -rotate-12 group-hover:rotate-0 transition-transform duration-700">
        <ShieldCheck size={140} />
      </div>

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
          <Info size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="font-black text-lg tracking-tight text-foreground">Admin Requirements</h3>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none mt-1">Infrastructure Governance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {requirements.map((req, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 bg-secondary/20 border border-border/40 rounded-2xl space-y-3 hover:bg-secondary/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 bg-background rounded-lg border border-border/50 text-primary">
                <req.icon size={18} />
              </div>
              <span className={cn(
                "text-[8px] font-black px-1.5 py-0.5 rounded-md border uppercase tracking-tighter",
                req.urgency === 'critical' ? "bg-destructive/10 text-destructive border-destructive/20" :
                  req.urgency === 'high' ? "bg-warning/10 text-warning border-warning/20" :
                    "bg-primary/10 text-primary border-primary/20"
              )}>
                {req.urgency}
              </span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground">{req.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1 font-medium italic">
                &quot;{req.description}&quot;
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-border/40 flex items-center justify-between relative z-10">
        <p className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-widest flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Global System Governance Active
        </p>
        <button className="text-[10px] font-black text-primary hover:underline uppercase tracking-tighter">
          Security Policy
        </button>
      </div>
    </div>
  );
};
