'use client';

import { Settings, ShieldAlert, Cpu, Globe, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { systemService, type ConfigItem } from '../services/system.service';

export const QuickConfig = () => {
  const [configs, setConfigs] = useState<ConfigItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchConfigs = async () => {
    try {
      const res = await systemService.getConfigs();
      if (res.success) {
        setConfigs(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch configs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleToggle = async (key: string, currentValue: unknown) => {
    try {
      setUpdating(key);
      const newValue = !currentValue;
      const res = await systemService.updateConfig(key, newValue);
      if (res.success) {
        setConfigs(prev => prev.map(c => c.key === key ? { ...c, value: newValue } : c));
      }
    } catch (error) {
      console.error(`Failed to update ${key}:`, error);
    } finally {
      setUpdating(null);
    }
  };

  const getConfig = (key: string) => configs.find(c => c.key === key);

  const maintenance = getConfig('maintenance_mode');
  const registration = getConfig('registration_enabled');

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border/60 rounded-2xl p-6 workspace-shadow space-y-6 relative overflow-hidden group hover:border-primary/30 transition-colors">
        <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Settings size={120} className="text-muted-foreground" />
        </div>
        
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h3 className="font-black text-xl tracking-tight text-foreground">Quick Config</h3>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-tight">Global override switches</p>
          </div>
          <button 
            onClick={() => fetchConfigs()}
            className="p-3 bg-secondary/80 rounded-xl shadow-inner border border-border/50 hover:bg-secondary transition-colors group/refresh"
          >
            <RefreshCcw size={18} className={cn("text-primary transition-transform duration-500", loading && "animate-spin")} />
          </button>
        </div>

        <div className="space-y-4 relative z-10">
          {/* Maintenance Mode */}
          <div className="p-5 bg-secondary/30 border border-border/40 rounded-2xl space-y-3 group/opt hover:bg-secondary/50 transition-all">
            <div className="flex items-center justify-between">
              <p className="text-sm font-black text-foreground flex items-center gap-2">
                <ShieldAlert size={16} className={maintenance?.value ? "text-destructive" : "text-muted-foreground"} />
                Maintenance Mode
              </p>
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase",
                maintenance?.value ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-success/10 text-success border-success/20"
              )}>
                {maintenance?.value ? "Active" : "Disabled"}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium leading-relaxed italic">Instantly disable non-admin operations across all nodes.</p>
            <div className="pt-1">
              <Button 
                variant={maintenance?.value ? "danger" : "outline"} 
                size="sm" 
                disabled={updating === 'maintenance_mode'}
                onClick={() => handleToggle('maintenance_mode', maintenance?.value)}
                className="w-full text-xs font-black h-10 rounded-xl border-border/60 shadow-sm transition-all"
              >
                {updating === 'maintenance_mode' ? "PROCESSING..." : (maintenance?.value ? "DISABLE MAINTENANCE" : "ENABLE MAINTENANCE")}
              </Button>
            </div>
          </div>

          {/* Global Registration */}
          <div className="p-5 bg-secondary/30 border border-border/40 rounded-2xl space-y-3 group/opt hover:bg-secondary/50 transition-all">
            <div className="flex items-center justify-between">
              <p className="text-sm font-black text-foreground flex items-center gap-2">
                <Globe size={16} className={registration?.value ? "text-primary" : "text-muted-foreground"} />
                Global Registration
              </p>
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase",
                registration?.value ? "bg-primary/10 text-primary border-primary/20" : "bg-destructive/10 text-destructive border-destructive/20"
              )}>
                {registration?.value ? "Enabled" : "Paused"}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium leading-relaxed italic">Allow new societies to onboard via the public root portal.</p>
            <div className="pt-1">
              <Button 
                variant={registration?.value ? "primary" : "outline"} 
                size="sm" 
                disabled={updating === 'registration_enabled'}
                onClick={() => handleToggle('registration_enabled', registration?.value)}
                className="w-full text-xs font-black h-10 shadow-lg rounded-xl transition-all"
              >
                {updating === 'registration_enabled' ? "PROCESSING..." : (registration?.value ? "PAUSE REGISTRATION" : "RESUME REGISTRATION")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Global Cluster Status Sub-card */}
      <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-2xl p-6 relative overflow-hidden group">
         <div className="absolute -bottom-2 -right-2 opacity-[0.03] group-hover:scale-110 transition-transform">
            <Cpu size={100} />
         </div>
         <div className="flex items-center gap-3 mb-5 relative z-10">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
              <Globe size={18} className="text-primary-foreground animate-[pulse_3s_infinite]" />
            </div>
            <h4 className="font-extrabold text-sm tracking-tight text-foreground uppercase">Propagation Status</h4>
         </div>
         <div className="space-y-3 relative z-10">
           {[
             { region: 'South Asia (Mumbai)', status: 'Optimal', delay: '12ms' },
             { region: 'US East (N. Virginia)', status: 'Active', delay: '84ms' },
             { region: 'Europe (Frankfurt)', status: 'Syncing', delay: '210ms' }
           ].map((r, i) => (
             <div key={i} className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-muted-foreground">{r.region}</span>
                <span className={cn(
                  "flex items-center gap-2",
                  r.status === 'Optimal' ? "text-success" : (r.status === 'Syncing' ? "text-warning" : "text-primary")
                )}>
                  <span className="text-[9px] font-mono opacity-60">[{r.delay}]</span>
                  <div className={cn("w-1.5 h-1.5 rounded-full", r.status === 'Optimal' ? "bg-success" : (r.status === 'Syncing' ? "bg-warning animate-pulse" : "bg-primary"))} />
                  {r.status}
                </span>
             </div>
           ))}
         </div>
      </div>
    </div>
  );
};
