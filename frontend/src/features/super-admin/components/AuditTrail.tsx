'use client';

import { Search, BarChart3, Filter, MoreHorizontal, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

const logs = [
  { type: 'Info', msg: 'New society "Green Valley" provisioned successfully', time: '2 mins ago', status: 'success', cluster: 'AP-SOUTH-1' },
  { type: 'Warning', msg: 'High CPU usage detected on Node-04 (Cluster A)', time: '15 mins ago', status: 'warning', cluster: 'US-EAST-1' },
  { type: 'Success', msg: 'Weekly global cleanup completed', time: '1 hour ago', status: 'success', cluster: 'EU-WEST-1' },
  { type: 'Alert', msg: 'Database connection delay detected', time: '3 hours ago', status: 'error', cluster: 'AP-SOUTH-1' },
  { type: 'Info', msg: 'Configuration update pushed to all edge nodes', time: '5 hours ago', status: 'success', cluster: 'Global' },
];

export const AuditTrail = () => {
  return (
    <div className="bg-card border border-border/60 rounded-2xl overflow-hidden workspace-shadow flex flex-col relative group">
      <div className="p-6 border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div>
          <h3 className="font-black text-xl tracking-tight text-foreground">Global Audit Trail</h3>
          <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5 uppercase tracking-wide">
            <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
            Live sync across all clusters
          </p>
        </div>
        <div className="flex items-center gap-2">
           <div className="relative group/search hidden sm:block">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/search:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Filter logs..." 
              className="bg-secondary/40 border border-transparent rounded-xl py-2 pl-10 pr-4 text-xs focus:bg-background focus:ring-1 focus:ring-primary focus:border-border transition-all w-64 hover:bg-secondary/60"
            />
          </div>
          <Button variant="outline" size="sm" className="h-9 px-3 gap-2 rounded-xl text-xs font-bold border-border/60">
            <Filter size={14} />
            Filters
          </Button>
          <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-xl border-border/60">
            <Download size={14} />
          </Button>
        </div>
      </div>

      <div className="flex-1 divide-y divide-border/40">
        {logs.map((log, i) => (
          <div key={i} className="flex items-center justify-between p-5 hover:bg-secondary/20 transition-all cursor-pointer group/item border-l-2 border-transparent hover:border-primary">
            <div className="flex items-center gap-5">
              <div className={cn(
                "w-2.5 h-2.5 rounded-full",
                log.status === 'error' ? 'bg-destructive shadow-[0_0_12px_rgba(239,68,68,0.4)]' : 
                log.status === 'warning' ? 'bg-warning' : 'bg-success shadow-[0_0_12px_rgba(34,197,94,0.3)]'
              )} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-foreground group-hover/item:text-primary transition-colors">{log.type}</span>
                  <span className="text-[9px] uppercase tracking-widest font-black text-muted-foreground/50 border border-border/40 px-1.5 py-0.5 rounded italic">{log.cluster}</span>
                </div>
                <p className="text-sm text-muted-foreground/90 mt-1 font-medium leading-tight">{log.msg}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] text-muted-foreground/70 font-mono bg-secondary/60 px-2.5 py-1.5 rounded-lg border border-border/20 group-hover/item:border-border transition-colors">{log.time}</span>
              <button className="p-1.5 hover:bg-secondary rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity">
                <MoreHorizontal size={14} className="text-muted-foreground" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-muted/10 border-t border-border/40 text-center">
        <Button variant="ghost" size="sm" className="text-xs font-black gap-2 hover:bg-primary/5 hover:text-primary transition-colors uppercase tracking-widest py-5 w-full">
          <BarChart3 size={15} strokeWidth={2.5} />
          Launch Deep Audit Inspector
        </Button>
      </div>
    </div>
  );
};
