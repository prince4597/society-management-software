'use client';

import { Building2, UserCheck, Activity, Users, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { systemService, type GlobalStats } from '../services/system.service';
import { useSocket } from '@/hooks/useSocket';

export const GlobalMetrics = () => {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const { on, isConnected } = useSocket();

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const res = await systemService.getStats();
            if (res.success) {
                setStats(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch global stats:', error);
        }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    if (!isConnected) return;
    return on<GlobalStats>('system:stats:update', (data) => {
        setStats(data);
    });
  }, [on, isConnected]);

  const displayMetrics = [
    { label: 'Total Societies', value: stats?.totalSocieties ?? '...', growth: '+3', icon: Building2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Active Admins', value: stats?.totalAdmins ?? '...', growth: 'Live', icon: UserCheck, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Network Load', value: isConnected ? `${stats?.activeConnections ?? '0'} Sockets` : 'Offline', growth: 'Stable', icon: Activity, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Total Users', value: stats?.totalUsers ?? '...', growth: '+210', icon: Users, color: 'text-warning', bg: 'bg-warning/10' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayMetrics.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-card border border-border/60 p-6 rounded-2xl workspace-shadow group hover:border-primary/50 transition-all hover:translate-y-[-4px] relative overflow-hidden"
        >
          {/* Subtle Background Pattern */}
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
            <stat.icon size={80} />
          </div>

          <div className="flex justify-between items-start mb-5 relative z-10">
            <div className={cn("p-3 rounded-xl shadow-inner transition-colors", stat.bg)}>
              <stat.icon size={22} className={stat.color} />
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-success bg-success/10 px-2.5 py-1 rounded-full uppercase tracking-tighter shadow-sm border border-success/20">
              {stat.growth}
              <ArrowUpRight size={12} strokeWidth={3} />
            </div>
          </div>
          <p className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-widest leading-none relative z-10">{stat.label}</p>
          <div className="flex items-baseline gap-1 mt-2 relative z-10">
            <motion.h3 
              key={String(stat.value)}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="text-3xl font-black text-foreground tracking-tighter"
            >
              {stat.value}
            </motion.h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
