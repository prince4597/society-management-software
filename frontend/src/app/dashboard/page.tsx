'use client';

import {
  Calendar,
  Plus,
  ArrowRight,
  CheckCircle2,
  Download,
  Info,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui';
import { StatsGrid, SecurityLogs, SocietyOverview } from '@/features/dashboard';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      {/* Workspace Native Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card p-6 sm:p-8 rounded-lg border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-colors duration-200 workspace-shadow"
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            Greetings, {user?.firstName}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <p className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <span className="hidden sm:inline opacity-30">•</span>
            <p className="flex items-center gap-1.5 text-success font-medium">
              <CheckCircle2 size={14} />
              All systems operational
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="md" className="gap-2">
            <Download size={16} />
            Export data
          </Button>
          <Button variant="primary" size="md" className="gap-2">
            <Plus size={18} />
            New Entry
          </Button>
        </div>
      </motion.div>

      <StatsGrid />

      {/* Modern Workspace Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8 space-y-6">
          <SecurityLogs />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border p-6 rounded-lg transition-all hover:workspace-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-success/10 rounded-full">
                  <CheckCircle2 className="text-success" size={18} />
                </div>
                <Info size={16} className="text-muted-foreground" />
              </div>
              <h4 className="font-semibold text-foreground text-base">Compliance Summary</h4>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Safety inspections for all blocks are up to date. Q1 mandatory audit certificates are available for download.
              </p>
              <div className="mt-4 flex items-center gap-2 text-primary text-sm font-medium cursor-pointer hover:underline">
                View audit history <ArrowRight size={14} />
              </div>
            </div>

            <div className="bg-card border border-border p-6 rounded-lg transition-all hover:workspace-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <TrendingUp className="text-primary" size={18} />
                </div>
                <Info size={16} className="text-muted-foreground" />
              </div>
              <h4 className="font-semibold text-foreground text-base">Efficiency Gains</h4>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Automation in common area lighting has reduced energy consumption by 12% over the last 30 days.
              </p>
              <div className="mt-4 flex items-center gap-2 text-primary text-sm font-medium cursor-pointer hover:underline">
                Consumption reports <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="xl:col-span-4 space-y-6">
          <SocietyOverview />

          <div className="bg-muted/30 border border-border p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-4 text-muted-foreground">
              <Clock size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Scheduled Tasks</span>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 group cursor-pointer">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-card border border-border rounded flex flex-col items-center justify-center shadow-sm">
                    <span className="text-[10px] text-destructive font-bold uppercase leading-none mt-1">Jan</span>
                    <span className="text-lg font-semibold text-foreground leading-none mb-1">28</span>
                  </div>
                  <div className="w-px h-full bg-border mt-2" />
                </div>
                <div className="pt-0.5">
                  <h5 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Q1 Safety Audit</h5>
                  <p className="text-xs text-muted-foreground mt-1">Full infrastructure check scheduled for 10:00 AM across all blocks.</p>
                </div>
              </div>

              <div className="flex gap-4 group cursor-pointer">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-card border border-border rounded flex flex-col items-center justify-center shadow-sm">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase leading-none mt-1">Feb</span>
                    <span className="text-lg font-semibold text-foreground leading-none mb-1">05</span>
                  </div>
                </div>
                <div className="pt-0.5">
                  <h5 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Resident Meet</h5>
                  <p className="text-xs text-muted-foreground mt-1">Monthly community gathering in Central Clubhouse at 6:00 PM.</p>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-6 text-xs h-9">
              Management Calendar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
