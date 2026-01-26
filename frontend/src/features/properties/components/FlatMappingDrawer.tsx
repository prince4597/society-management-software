'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, User, Phone, Mail, CreditCard, Users, ShieldCheck, Home, AlertCircle, TrendingUp, Wallet, CheckCircle2 } from 'lucide-react';
import { Flat, OccupancyStatus, MaintenanceRule, MaintenanceStatus } from '../types';
import { Resident } from '../../residents/types';
import { OwnerBadge, TenantBadge, FamilyBadge } from '../../residents/components/ResidentBadges';
import { FamilyMemberList } from '../../residents/components/FamilyMemberList';
import { Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface FlatMappingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  flat: Flat | null;
  owner?: Resident;
  tenant?: Resident;
}

export const FlatMappingDrawer = ({
  isOpen,
  onClose,
  flat,
  owner,
  tenant,
}: FlatMappingDrawerProps) => {
  if (!flat) return null;

  const isRented = flat.occupancyStatus === OccupancyStatus.RENTED;
  const isMaintenanceOverdue = flat.maintenanceStatus === MaintenanceStatus.OVERDUE;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-background/40 backdrop-blur-md"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-[110] w-full max-w-lg bg-card border-l border-border shadow-2xl overflow-y-auto custom-scrollbar"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-card border-b border-border p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Home size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground tracking-tight leading-none mb-1">
                    Flat {flat.number}
                  </h2>
                  <div className="flex items-center gap-2">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none">
                        Allocation Unit
                      </p>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <p className="text-[10px] text-primary font-bold uppercase tracking-widest leading-none">
                        {flat.unitType}
                      </p>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-secondary transition-colors border border-transparent hover:border-border"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-10">
              {/* Status Section */}
              <section className="bg-secondary/10 p-6 rounded-xl border border-border/60 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Allocation Status
                  </h3>
                  <Badge 
                    variant={
                      flat.occupancyStatus === OccupancyStatus.OWNER_OCCUPIED ? 'success' :
                      flat.occupancyStatus === OccupancyStatus.RENTED ? 'info' : 'neutral'
                    }
                    className="rounded-md px-2 py-0.5 text-[9px] font-bold"
                  >
                    {flat.occupancyStatus.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-card border border-border shadow-sm">
                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mb-1.5">Elevator Level</p>
                    <p className="text-base font-bold text-foreground">Floor {flat.floor}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-card border border-border shadow-sm">
                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mb-1.5">Building Block</p>
                    <p className="text-base font-bold text-foreground">SEC-{flat.block}</p>
                  </div>
                </div>
              </section>

              {/* Maintenance Alert Card (If Overdue) */}
              {isMaintenanceOverdue && (
                <div className="p-4 rounded-xl bg-danger/5 border border-danger/20 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-danger/10 text-danger shrink-0">
                        <AlertCircle size={18} />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-danger uppercase tracking-tight">Maintenance Overdue</h4>
                        <p className="text-[11px] text-danger/70 font-semibold mt-1 leading-relaxed">
                            Outstanding dues detected. Automated gate passes restricted until settlement.
                        </p>
                    </div>
                </div>
              )}

              {/* Advanced Mapping - Relational View */}
              <div className="space-y-8 relative">
                <div className="absolute left-5 top-8 bottom-8 w-px bg-border" />

                {/* Primary Owner Node */}
                <section className="relative pl-12 space-y-4">
                  <div className="absolute left-5 top-4 w-4 h-px bg-border" />
                  <div className="flex items-center justify-between">
                    <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      Proprietor Registry
                    </h3>
                    <OwnerBadge />
                  </div>
                  {owner ? (
                    <div className="p-5 rounded-xl bg-card border border-border shadow-sm space-y-4 group hover:border-primary/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center border border-border text-muted-foreground/60">
                           <User size={24} />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-foreground tracking-tight">
                            {owner.firstName} {owner.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground font-semibold">
                            {owner.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                         <Button variant="outline" size="sm" className="flex-1 rounded-lg h-9 text-[9px] font-bold uppercase tracking-widest">
                           <Phone size={14} className="mr-2 opacity-60" /> Connect
                         </Button>
                         <Button variant="outline" size="sm" className="flex-1 rounded-lg h-9 text-[9px] font-bold uppercase tracking-widest">
                           <Mail size={14} className="mr-2 opacity-60" /> Message
                         </Button>
                      </div>
                    </div>
                  ) : (
                    <Button variant="outline" className="w-full border-dashed rounded-xl py-10 text-muted-foreground font-bold uppercase tracking-widest text-[9px] bg-secondary/5">
                      + Link Primary Owner
                    </Button>
                  )}
                </section>

                {/* Tenant Node (Conditional) */}
                {isRented && (
                  <section className="relative pl-12 space-y-4">
                    <div className="absolute left-5 top-4 w-4 h-px bg-border" />
                    <div className="flex items-center justify-between">
                      <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                        Residential Tenant
                      </h3>
                      <TenantBadge />
                    </div>
                    {tenant ? (
                      <div className="p-5 rounded-xl bg-card border border-border shadow-sm space-y-4 group hover:border-info/30 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-info/5 flex items-center justify-center border border-info/10 text-info/60">
                             <User size={24} />
                          </div>
                          <div>
                            <p className="text-lg font-bold text-foreground tracking-tight">
                              {tenant.firstName} {tenant.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground font-semibold">
                              {tenant.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                           <Button variant="outline" size="sm" className="flex-1 rounded-lg h-9 text-[9px] font-bold uppercase tracking-widest">
                             <Phone size={14} className="mr-2 opacity-60" /> Connect
                           </Button>
                           <Button variant="outline" size="sm" className="flex-1 rounded-lg h-9 text-[9px] font-bold uppercase tracking-widest">
                             <Mail size={14} className="mr-2 opacity-60" /> Message
                           </Button>
                        </div>
                      </div>
                    ) : (
                      <Button variant="outline" className="w-full border-dashed rounded-xl py-10 text-muted-foreground font-bold uppercase tracking-widest text-[9px] bg-secondary/5">
                        + Link Occupant Tenant
                      </Button>
                    )}
                  </section>
                )}
              </div>

              {/* Financial & Ledger Section */}
              <section className="pt-8 border-t border-border space-y-5">
                <div className="flex items-center justify-between">
                    <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Financial Oversight
                    </h3>
                    <TrendingUp size={16} className="text-primary/30" />
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                    <div className="p-4 rounded-xl bg-card border border-border shadow-sm flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-success/5 flex items-center justify-center text-success border border-success/10 group-hover:bg-success group-hover:text-white transition-all">
                                <Wallet size={18} />
                            </div>
                            <div>
                                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Payer Rule</p>
                                <p className="text-sm font-bold text-foreground">
                                    {flat.maintenanceRule === MaintenanceRule.DEFAULT_OWNER ? 'Settled by Owner' : 'Direct Tenant Payment'}
                                </p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="rounded-md h-8 px-3 text-[9px] font-bold uppercase tracking-widest">
                            Config
                        </Button>
                    </div>

                    <div className={cn(
                        "p-4 rounded-xl bg-card border shadow-sm flex items-center justify-between group transition-all",
                        isMaintenanceOverdue ? "border-danger/30 bg-danger/[0.02]" : "border-border"
                    )}>
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center border transition-all",
                                isMaintenanceOverdue ? "bg-danger text-white border-danger" : "bg-success/5 text-success border-success/10"
                            )}>
                                {isMaintenanceOverdue ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                            </div>
                            <div>
                                <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Current Ledger</p>
                                <p className={cn("text-sm font-bold", isMaintenanceOverdue ? "text-danger" : "text-success")}>
                                    Maintenance {flat.maintenanceStatus}
                                </p>
                            </div>
                        </div>
                        <Button variant={isMaintenanceOverdue ? 'danger' : 'outline'} size="sm" className={cn(
                            "rounded-md h-8 px-3 text-[9px] font-bold uppercase tracking-widest",
                            isMaintenanceOverdue && "shadow-md shadow-danger/10"
                        )}>
                            {isMaintenanceOverdue ? 'Collect' : 'Logs'}
                        </Button>
                    </div>
                </div>
              </section>
            </div>

            {/* Sticky Actions Ledger */}
            <div className="sticky bottom-0 p-6 bg-card border-t border-border flex gap-3">
              <Button variant="outline" className="flex-1 rounded-lg font-bold uppercase tracking-widest text-[10px] h-12">
                Audit Trail
              </Button>
              <Button className="flex-[2] rounded-lg font-bold uppercase tracking-widest text-[10px] h-12 shadow-md shadow-primary/10">
                Update Asset Mapping
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
