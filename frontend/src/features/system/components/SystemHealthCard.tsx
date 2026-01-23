'use client';

import { Activity, HardDrive, Zap, Info, Clock, Wifi, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { systemService } from '../api/system.service';
import type { SystemHealth } from '@/types';
import { useSocket } from '@/hooks/useSocket';

interface SystemHealthCardProps {
  initialData?: SystemHealth | null;
}

export const SystemHealthCard = ({ initialData }: SystemHealthCardProps) => {
  const [health, setHealth] = useState<SystemHealth | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(initialData ? new Date() : null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { on, isConnected } = useSocket();

  // Initial Fetch as Fallback
  useEffect(() => {
    if (initialData) return;
    const fetchInitialHealth = async () => {
      try {
        const data = await systemService.getHealth();
        setHealth(data);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Initial health fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialHealth();
  }, [initialData]);

  // Real-time WebSocket Listeners
  useEffect(() => {
    if (!isConnected) return;

    const cleanup = on<SystemHealth>('health:update', (data) => {
      setHealth(data);
      setLastUpdate(new Date());
      setIsUpdating(true);
      setTimeout(() => setIsUpdating(false), 500);
    });
    return cleanup;
  }, [on, isConnected]);

  if (loading || !health) {
    return (
      <div className="h-[280px] bg-card border border-border rounded-2xl animate-pulse flex items-center justify-center">
        <div className="premium-spinner" />
      </div>
    );
  }

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatAbsoluteDateFromUptime = (uptimeSeconds: number) => {
    const referenceTime = health ? new Date(health.timestamp).getTime() : Date.now();
    const bootDate = new Date(referenceTime - uptimeSeconds * 1000);
    const day = bootDate.getDate();
    const month = bootDate.toLocaleString('en-US', { month: 'short' });
    const time = bootDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).replace(/^0/, '');

    return `${day} ${month}, ${time}`;
  };

  const getLoadColor = (load: number) => {
    if (load > 4) return 'text-destructive';
    if (load > 2) return 'text-warning';
    return 'text-success';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card border border-border rounded-2xl p-6 workspace-shadow overflow-hidden group relative"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Activity size={120} className="text-primary" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
            System Infrastructure
            <div className={cn(
              "w-2 h-2 rounded-full",
              isConnected ? "bg-success animate-pulse" : "bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.5)]"
            )} />
          </h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">
            Real-time Monitoring • v{health.version} • {health.system.platform}
          </p>
        </div>
        <div className="flex items-center gap-3 relative z-10 self-start md:self-center">
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all duration-300",
            isConnected
              ? "bg-success/10 text-success border-success/20"
              : "bg-destructive/10 text-destructive border-destructive/20"
          )}>
            {isConnected ? <Wifi size={12} className={cn(isUpdating && "animate-bounce")} /> : <WifiOff size={12} />}
            {isConnected ? "Live Stream" : "Disconnected"}
          </div>
          <div className={cn(
            "p-2.5 bg-primary/10 rounded-xl shadow-inner transition-transform duration-300",
            isUpdating && "scale-110"
          )}>
            <Zap className="text-primary" size={20} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">

        {/* Memory Load */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-semibold">
              <HardDrive size={16} className="text-blue-500" />
              <span>Memory Usage</span>
            </div>
            <span className="font-bold text-foreground font-mono">{health.checks.memory.percentage}%</span>
          </div>
          <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
            <motion.div
              initial={false}
              animate={{ width: `${health.checks.memory.percentage}%` }}
              className={cn(
                "h-full rounded-full transition-all duration-700 ease-out",
                health.checks.memory.percentage > 90 ? "bg-destructive" : health.checks.memory.percentage > 70 ? "bg-warning" : "bg-blue-500"
              )}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-muted-foreground font-medium italic">
            <span>{health.checks.memory.heapUsed}MB Used</span>
            <span>{health.checks.memory.heapTotal}MB Total</span>
          </div>
        </div>

        {/* CPU Load */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-semibold">
              <Activity size={16} className="text-warning" />
              <span>CPU Load</span>
            </div>
            <div className="flex gap-1.5 items-center">
              {health.system.loadAvg.map((load, i) => (
                <span key={i} className={cn("font-bold font-mono text-xs", getLoadColor(load))}>
                  {load.toFixed(1)}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="bg-secondary/30 px-2 py-1 rounded text-[10px] text-muted-foreground font-mono">
              1m, 5m, 15m averages
            </div>
            <div className="bg-secondary/30 px-2 py-1 rounded text-[10px] text-muted-foreground font-mono uppercase">
              {health.system.cpus} Cores
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground font-medium italic truncate" title={health.system.cpuModel}>
            {health.system.cpuModel}
          </p>
        </div>

        {/* WebSocket Metrics */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-semibold">
              <Wifi size={16} className="text-success" />
              <span>Active Sockets</span>
            </div>
            <span className="font-bold text-foreground font-mono">{health.sockets.totalConnections}</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 flex-1 bg-secondary/50 rounded-full overflow-hidden">
              <motion.div
                initial={false}
                animate={{ width: `${Math.min((health.sockets.totalConnections / 100) * 100, 100)}%` }}
                className="h-full bg-success rounded-full"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px] text-muted-foreground font-medium italic">
              <span>Total Connections</span>
              <span className="font-bold text-foreground">{health.sockets.totalConnections}</span>
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground font-medium italic">
              <span>Admins Online</span>
              <span className="font-bold text-primary">{health.sockets.adminConnections}</span>
            </div>
          </div>
        </div>

        {/* Engine Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-semibold">
              <Clock size={16} className="text-primary" />
              <span>Engine Status</span>
            </div>
            <span className="text-[9px] text-success font-black uppercase px-2 py-0.5 bg-success/10 rounded-md border border-success/20 animate-pulse">Running</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-foreground tracking-tight tabular-nums leading-none">
              {formatAbsoluteDateFromUptime(health.uptime)}
            </span>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
              Engine Last Boot
            </span>
          </div>
          <div className="flex flex-col gap-1 text-[10px] text-muted-foreground font-medium italic border-t border-border/40 pt-2">
            <div className="flex justify-between">
              <span>Active Duration:</span>
              <span className="font-mono font-bold text-primary">{formatDuration(health.uptime)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-muted-foreground relative z-10">
        <div className="flex flex-wrap gap-4 sm:gap-6 uppercase tracking-widest font-black">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            Node: Production-Master-01
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-success" />
            Stream: Fully Synchronized
          </div>
          {lastUpdate && (
            <div className="flex items-center gap-1.5 text-muted-foreground/60">
              <Clock size={12} />
              Last Data: {lastUpdate.toLocaleTimeString()}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer group whitespace-nowrap">
          <Info size={14} className="group-hover:rotate-12 transition-transform" />
          Server Details
        </div>
      </div>
    </motion.div>
  );
};
