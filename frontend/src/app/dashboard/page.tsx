'use client';

import {
  Calendar,
  Plus,
  ArrowRight,
  Target,
  CheckCircle2,
  Download,
  Info,
  Clock,
  TrendingUp,
  Layout
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { StatsGrid } from '@/features/dashboard/components/Stats/StatsGrid';
import { SecurityLogs } from '@/features/dashboard/components/Security/SecurityLogs';
import { SocietyOverview } from '@/features/dashboard/components/Society/SocietyOverview';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  useAuth();

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      {/* Workspace Native Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-[#202124] p-8 rounded-lg border border-[#dadce0] dark:border-[#3c4043] flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-colors duration-200"
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-normal text-[#202124] dark:text-[#e8eaed] tracking-tight">
            Dashboard
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#5f6368] dark:text-[#9aa0a6]">
            <p className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <span className="hidden sm:inline opacity-30">•</span>
            <p className="flex items-center gap-1.5 text-[#137333] dark:text-[#81c995] font-medium">
              <CheckCircle2 size={14} />
              All systems operational
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 px-4 h-10 border border-[#dadce0] dark:border-[#3c4043] rounded bg-white dark:bg-[#202124] hover:bg-[#f8f9fa] dark:hover:bg-[#303134] text-sm font-medium text-[#3c4043] dark:text-[#e8eaed] transition-colors">
            <Download size={16} />
            Export data
          </button>
          <button className="inline-flex items-center gap-2 px-4 h-10 bg-[#1a73e8] dark:bg-[#8ab4f8] hover:bg-[#1557b0] dark:hover:bg-[#aecbfa] rounded text-sm font-medium text-white dark:text-[#202124] transition-colors shadow-sm">
            <Plus size={18} />
            New Entry
          </button>
        </div>
      </motion.div>

      <StatsGrid />

      {/* Modern Workspace Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8 space-y-6">
          <SecurityLogs />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#202124] border border-[#dadce0] dark:border-[#3c4043] p-6 rounded-lg transition-all hover:workspace-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-[#e6f4ea] dark:bg-[#1e332a] rounded">
                  <CheckCircle2 className="text-[#137333] dark:text-[#81c995]" size={18} />
                </div>
                <Info size={16} className="text-[#5f6368] dark:text-[#9aa0a6]" />
              </div>
              <h4 className="font-medium text-[#202124] dark:text-[#e8eaed] text-base">Compliance Summary</h4>
              <p className="text-sm text-[#5f6368] dark:text-[#9aa0a6] mt-2 leading-relaxed">Safety inspections for all blocks are up to date. Q1 mandatory audit certificates are available for download.</p>
              <div className="mt-4 flex items-center gap-2 text-[#1a73e8] dark:text-[#8ab4f8] text-sm font-medium cursor-pointer hover:underline">
                View audit history <ArrowRight size={14} />
              </div>
            </div>

            <div className="bg-white dark:bg-[#202124] border border-[#dadce0] dark:border-[#3c4043] p-6 rounded-lg transition-all hover:workspace-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-[#e8f0fe] dark:bg-blue-900/20 rounded">
                  <TrendingUp className="text-[#1a73e8] dark:text-[#8ab4f8]" size={18} />
                </div>
                <Info size={16} className="text-[#5f6368] dark:text-[#9aa0a6]" />
              </div>
              <h4 className="font-medium text-[#202124] dark:text-[#e8eaed] text-base">Efficiency Gains</h4>
              <p className="text-sm text-[#5f6368] dark:text-[#9aa0a6] mt-2 leading-relaxed">Automation in common area lighting has reduced energy consumption by 12% over the last 30 days.</p>
              <div className="mt-4 flex items-center gap-2 text-[#1a73e8] dark:text-[#8ab4f8] text-sm font-medium cursor-pointer hover:underline">
                Consumption reports <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="xl:col-span-4 space-y-6">
          <SocietyOverview />

          <div className="bg-[#f8f9fa] dark:bg-black/20 border border-[#dadce0] dark:border-[#3c4043] p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-4 text-[#5f6368] dark:text-[#9aa0a6]">
              <Clock size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Scheduled Tasks</span>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 group cursor-pointer">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-white dark:bg-[#202124] border border-[#dadce0] dark:border-[#3c4043] rounded flex flex-col items-center justify-center shadow-sm">
                    <span className="text-[10px] text-[#d93025] font-bold uppercase leading-none mt-1">Jan</span>
                    <span className="text-lg font-normal text-[#202124] dark:text-[#e8eaed] leading-none mb-1">28</span>
                  </div>
                  <div className="w-px h-full bg-[#dadce0] dark:bg-[#3c4043] mt-2" />
                </div>
                <div className="pt-0.5">
                  <h5 className="text-sm font-medium text-[#202124] dark:text-[#e8eaed] group-hover:text-[#1a73e8] transition-colors">Q1 Safety Audit</h5>
                  <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] mt-1">Full infrastructure check scheduled for 10:00 AM across all blocks.</p>
                </div>
              </div>

              <div className="flex gap-4 group cursor-pointer">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-white dark:bg-[#202124] border border-[#dadce0] dark:border-[#3c4043] rounded flex flex-col items-center justify-center shadow-sm">
                    <span className="text-[10px] text-[#5f6368] dark:text-[#9aa0a6] font-bold uppercase leading-none mt-1">Feb</span>
                    <span className="text-lg font-normal text-[#202124] dark:text-[#e8eaed] leading-none mb-1">05</span>
                  </div>
                </div>
                <div className="pt-0.5">
                  <h5 className="text-sm font-medium text-[#202124] dark:text-[#e8eaed] group-hover:text-[#1a73e8] transition-colors">Resident Meet</h5>
                  <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] mt-1">Monthly community gathering in Central Clubhouse at 6:00 PM.</p>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 py-2 border border-[#dadce0] dark:border-[#3c4043] rounded text-[#3c4043] dark:text-[#e8eaed] bg-white dark:bg-[#202124] hover:bg-[#f8f9fa] dark:hover:bg-[#303134] text-xs font-medium transition-colors">
              Management Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
