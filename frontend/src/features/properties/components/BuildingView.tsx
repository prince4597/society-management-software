'use client';

import { useState } from 'react';
import { Flat, OccupancyStatus, MaintenanceStatus } from '../types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Layout, Database } from 'lucide-react';

import { Resident } from '../../residents/types';

interface BuildingViewProps {
  blockName: string;
  flats: Flat[];
  onFlatClick: (flat: Flat) => void;
}

export const BuildingView = ({ blockName, flats, onFlatClick }: BuildingViewProps) => {
  const [hoveredFloor, setHoveredFloor] = useState<number | null>(null);

  const groupedByFloor = flats.reduce((acc: Record<number, Flat[]>, flat: Flat) => {
    if (!acc[flat.floor]) acc[flat.floor] = [];
    acc[flat.floor].push(flat);
    return acc;
  }, {} as Record<number, Flat[]>);

  const floors = Object.keys(groupedByFloor).map(Number).sort((a, b) => b - a);
  const isVacant = (f: Flat) => f.occupancyStatus === OccupancyStatus.VACANT;

  return (
    <div className="relative w-full min-h-[1000px] flex flex-col items-center bg-background border border-border rounded-[3rem] shadow-2xl overflow-hidden p-12">
      {/* CAD Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      {/* Modern Technical Header */}
      <header className="relative w-full flex flex-col items-center mb-24 z-20">
        <div className="flex items-center gap-3 px-5 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Sector Registry Alpha</span>
        </div>
        <h2 className="text-5xl font-black text-foreground tracking-tight flex items-center gap-6">
          <span className="opacity-20 translate-y-1">#</span>
          BLOCK <span className="text-primary italic font-serif px-4 py-1 bg-secondary rounded-2xl border border-border">{blockName}</span> Schematic
        </h2>
        <div className="mt-8 flex gap-8">
          <HeaderStat label="Assets" value={flats.length} />
          <HeaderStat label="Live Index" value="99.2%" />
          <HeaderStat label="Protocol" value="Verified" />
        </div>
      </header>

      {/* Tactical Building Stack */}
      <div className="relative w-full max-w-4xl flex flex-col gap-6">
        {floors.map((floor) => {
          const isFocused = hoveredFloor === floor;

          return (
            <motion.div
              key={floor}
              onMouseEnter={() => setHoveredFloor(floor)}
              onMouseLeave={() => setHoveredFloor(null)}
              animate={{
                y: isFocused ? -8 : 0,
                scale: isFocused ? 1.01 : 1,
              }}
              className={cn(
                "relative group/floor p-8 rounded-[2rem] border-2 transition-all duration-300",
                isFocused
                  ? "bg-card border-primary/40 shadow-2xl ring-4 ring-primary/5"
                  : "bg-secondary/40 border-border/60 hover:border-primary/20 hover:bg-secondary/60"
              )}
            >
              {/* Floor Identifier */}
              <div className="absolute -left-20 top-1/2 -translate-y-1/2 opacity-20 group-hover/floor:opacity-100 transition-all group-hover/floor:-translate-x-2">
                <p className="text-[9px] font-black text-muted-foreground uppercase leading-none mb-1">Floor</p>
                <p className="text-3xl font-black text-foreground tracking-tighter italic">L-{floor}</p>
              </div>

              <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-primary/60">
                      <Layout size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-foreground text-sm uppercase tracking-widest leading-none mb-1">Unit Allocation Map</h4>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">System Verified - Level {floor}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-success/40" />
                    <div className="w-1.5 h-1.5 rounded-full bg-success/40" />
                    <div className="w-1.5 h-1.5 rounded-full bg-success/40" />
                  </div>
                </div>

                {/* Simplified Minimalist Unit Units */}
                <div className="flex flex-wrap gap-4 justify-start w-full relative z-10 px-4">
                  {groupedByFloor[floor].map((flat) => (
                    <motion.button
                      key={flat.id}
                      whileHover={{ scale: 1.05, y: -4, backgroundColor: 'var(--background)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onFlatClick(flat)}
                      className={cn(
                        "relative flex flex-col items-center justify-center w-[130px] h-[110px] rounded-3xl border-2 transition-all group/unit",
                        isVacant(flat)
                          ? "bg-secondary/20 border-dashed border-border/60 hover:border-primary/40"
                          : "bg-card border-border shadow-sm hover:border-primary hover:shadow-xl hover:shadow-primary/10",
                        flat.maintenanceStatus === MaintenanceStatus.OVERDUE && "border-danger ring-8 ring-danger/5"
                      )}
                    >
                      {/* Status Indicator Dot */}
                      <div className={cn(
                        "absolute top-3 right-3 w-2 h-2 rounded-full",
                        flat.maintenanceStatus === MaintenanceStatus.PAID ? "bg-success" :
                          flat.maintenanceStatus === MaintenanceStatus.DUE ? "bg-warning" : "bg-danger"
                      )} />

                      <span className="text-2xl font-black text-foreground tracking-tighter mb-1">
                        #{flat.number}
                      </span>

                      <div className="flex flex-col items-center gap-1.5">
                        <Badge variant="neutral" className="bg-secondary/80 text-[8px] font-black uppercase px-2 h-4 rounded-md border-0">
                          {flat.unitType}
                        </Badge>
                        <span className={cn(
                          "text-[7px] font-black uppercase tracking-widest",
                          flat.occupancyStatus === OccupancyStatus.VACANT ? "text-muted-foreground/40" :
                            flat.occupancyStatus === OccupancyStatus.RENTED ? "text-info" : "text-success"
                        )}>
                          {flat.occupancyStatus.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Hover Accent Line */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary/20 group-hover:w-8 group-hover:bg-primary transition-all rounded-full" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Industrial Footer Engine */}
      <footer className="mt-24 w-full flex flex-col items-center gap-8">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="flex items-center gap-12 bg-secondary/30 border border-border rounded-3xl px-12 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-primary shadow-2xl">
              <Database size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1.5">Asset Registry Base</p>
              <p className="text-xs font-bold text-foreground">MAIN LOBBY | COMMAND 01</p>
            </div>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="flex gap-4">
            <LegendChip color="bg-success" label="Healthy Asset" />
            <LegendChip color="bg-warning" label="Pending Dues" />
            <LegendChip color="bg-danger" label="Critical Protocol" />
          </div>
        </div>
      </footer>
    </div>
  );
};

const HeaderStat = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex flex-col items-center border-x border-border/40 px-8">
    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{label}</span>
    <span className="text-lg font-black text-foreground">{value}</span>
  </div>
);

const LegendChip = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-2.5 px-4 py-2 bg-background border border-border rounded-xl shadow-sm">
    <div className={cn("w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]", color)} />
    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{label}</span>
  </div>
);

// Simple Badge component for styling
const Badge = ({ children, variant, className }: { children: React.ReactNode; variant?: 'default' | 'success' | 'info' | 'neutral' | 'warning' | 'danger'; className?: string }) => {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  const variantClasses = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    info: "bg-info/10 text-info",
    neutral: "bg-muted text-muted-foreground",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
  };
  return (
    <span className={cn(baseClasses, variantClasses[variant || 'default'], className)}>
      {children}
    </span>
  );
};