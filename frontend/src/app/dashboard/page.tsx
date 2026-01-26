'use client';

import {
  Calendar,
  ArrowRight,
  CheckCircle2,
  Clock,
  TrendingUp,
  Building2,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { Button, Badge } from '@/components/ui';
import { StatsGrid, SecurityLogs, SocietyOverview } from '@/features/dashboard';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-12">
      {/* ERP Native Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-card p-10 rounded-2xl border border-border shadow-sm overflow-hidden"
      >
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -mr-16 -mt-16 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge
                  variant="neutral"
                  className="bg-secondary/80 text-muted-foreground border-border/50 font-bold uppercase tracking-[0.2em] text-[9px] px-2 h-5"
                >
                  Internal Console
                </Badge>
                {user?.role && (
                  <Badge
                    variant="info"
                    className="bg-primary/5 text-primary border-primary/20 uppercase font-black tracking-widest text-[9px] px-2 h-5 italic"
                  >
                    {user.role}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-black text-foreground tracking-tight leading-tight">
                Welcome back,{' '}
                <span className="text-primary">
                  {user?.firstName} {user?.lastName}
                </span>
              </h1>
              {user?.society && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 size={18} className="text-primary/40" />
                  <span className="text-lg font-bold tracking-tight text-foreground/80">
                    {user.society.name}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2">
              <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground/80 uppercase tracking-widest bg-secondary/30 px-3 py-1.5 rounded-lg border border-border/40">
                <Calendar size={14} className="text-primary/60" />
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
              <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                <Clock size={14} />
                Last login:{' '}
                {user?.lastLogin
                  ? new Date(user.lastLogin).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                Instance Status
              </p>
              <p className="text-sm font-bold text-success">Operational 100%</p>
            </div>
            <div className="w-px h-8 bg-border hidden sm:block mx-2" />
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
              <Shield size={22} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </motion.div>

      <StatsGrid />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-8 space-y-8">
          <SecurityLogs />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border p-8 rounded-xl shadow-sm hover:border-primary/30 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-success/10 rounded-lg border border-success/20">
                  <CheckCircle2 className="text-success" size={20} />
                </div>
                <Badge variant="success" size="sm" className="font-bold">
                  STATUS: OK
                </Badge>
              </div>
              <h4 className="font-bold text-foreground text-base">Operational Compliance</h4>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed font-medium">
                Safety inspections for all blocks have been verified for the current cycle.
                Mandatory certificates are ready.
              </p>
              <div className="mt-6 flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest cursor-pointer hover:underline">
                View audit history <ArrowRight size={14} />
              </div>
            </div>

            <div className="bg-card border border-border p-8 rounded-xl shadow-sm hover:border-primary/30 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-primary/10 rounded-lg border border-primary/20">
                  <TrendingUp className="text-primary" size={20} />
                </div>
                <Badge variant="info" size="sm" className="font-bold">
                  EFFICIENCY: PEAK
                </Badge>
              </div>
              <h4 className="font-bold text-foreground text-base">Energy Optimization</h4>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed font-medium">
                Recent automation in tower lighting has reduced energy footprints across all shared
                common facilities.
              </p>
              <div className="mt-6 flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest cursor-pointer hover:underline">
                Consumption reports <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 space-y-8">
          <SocietyOverview />

          <div className="bg-card border border-border p-8 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-secondary/50 rounded-lg border border-border/50">
                <Clock size={16} className="text-muted-foreground" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Management Schedule
              </span>
            </div>

            <div className="space-y-6">
              <div className="flex gap-5 group cursor-pointer">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-secondary/30 border border-border rounded-xl flex flex-col items-center justify-center shadow-sm group-hover:border-primary/50 transition-all">
                    <span className="text-[10px] text-destructive font-black uppercase leading-none mt-1">
                      Jan
                    </span>
                    <span className="text-lg font-bold text-foreground leading-none mb-1">28</span>
                  </div>
                  <div className="w-px h-full bg-border mt-3" />
                </div>
                <div className="pt-1">
                  <h5 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    Safety Audit
                  </h5>
                  <p className="text-[11px] text-muted-foreground mt-1 font-medium leading-relaxed">
                    Quarterly inspection across blocks A-D.
                  </p>
                </div>
              </div>

              <div className="flex gap-5 group cursor-pointer">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-secondary/30 border border-border rounded-xl flex flex-col items-center justify-center shadow-sm group-hover:border-primary/50 transition-all">
                    <span className="text-[10px] text-muted-foreground font-black uppercase leading-none mt-1">
                      Feb
                    </span>
                    <span className="text-lg font-bold text-foreground leading-none mb-1">05</span>
                  </div>
                </div>
                <div className="pt-1">
                  <h5 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    Resident Liaison
                  </h5>
                  <p className="text-[11px] text-muted-foreground mt-1 font-medium leading-relaxed">
                    Monthly community gathering at clubhouse.
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full mt-10 rounded-lg border-border/60 hover:bg-secondary/20 h-10 font-bold uppercase tracking-widest text-[10px]"
            >
              Full Calendar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
