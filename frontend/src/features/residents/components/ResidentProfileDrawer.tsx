'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Mail, Home, Users, MapPin, ExternalLink, Calendar, Shield, Database, ShieldCheck } from 'lucide-react';
import { Resident, ResidentRole } from '../types';
import { Flat } from '../../properties/types';
import { MOCK_FLATS } from '../../properties/data/mockData';
import { OwnerBadge, TenantBadge, FamilyBadge } from './ResidentBadges';
import { FamilyMemberList } from './FamilyMemberList';
import { Button, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

interface ResidentProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  resident: Resident | null;
}

export const ResidentProfileDrawer = ({
  isOpen,
  onClose,
  resident,
}: ResidentProfileDrawerProps) => {
  if (!resident) return null;

  const linkedFlats = MOCK_FLATS.filter(f => resident.flatIds.includes(f.id));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-background/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-[210] w-full max-w-lg bg-card border-l border-border shadow-2xl overflow-y-auto custom-scrollbar flex flex-col"
          >
            {/* Unified Drawer Header */}
            <div className="sticky top-0 z-10 bg-card border-b border-border p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <User size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground tracking-tight leading-none mb-1">
                    Member profile
                  </h2>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-none">
                    Verified Registry Entity
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-secondary transition-colors border border-transparent hover:border-border"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 p-8 space-y-10">
              {/* Profile Contextual Identity */}
              <div className="bg-secondary/10 p-6 rounded-2xl border border-border/60 flex flex-col items-center sm:items-start sm:flex-row gap-6">
                <div className="w-20 h-20 rounded-2xl bg-foreground text-background shadow-xl flex items-center justify-center relative shrink-0">
                   <User size={36} />
                </div>
                <div className="text-center sm:text-left pt-2">
                  <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase leading-none mb-3">
                    {resident.firstName} {resident.lastName}
                  </h2>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                     <div className="scale-110 origin-left">
                        {resident.role === ResidentRole.PRIMARY_OWNER ? <OwnerBadge /> : <TenantBadge />}
                     </div>
                     <Badge 
                        variant={resident.isResident ? 'success' : 'warning'} 
                        className="h-6 text-[9px] font-black px-3 rounded-lg flex items-center gap-1.5 uppercase tracking-widest border-0"
                     >
                        <Shield size={10} />
                        {resident.isResident ? 'In-Premise' : 'Absentee'}
                     </Badge>
                  </div>
                </div>
              </div>

              {/* Secure Contact Matrix */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                    <Database size={12} /> Secure Contact Matrix
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-card border border-border/60 shadow-sm flex items-center gap-4 hover:border-primary/20 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center text-primary/60 border border-border">
                            <Phone size={16} />
                        </div>
                        <div>
                            <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mb-1">Mobile</p>
                            <p className="text-sm font-bold text-foreground tracking-tight">{resident.phoneNumber}</p>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-card border border-border/60 shadow-sm flex items-center gap-4 hover:border-primary/20 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center text-primary/60 border border-border">
                            <Mail size={16} />
                        </div>
                        <div className="truncate">
                            <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mb-1">Email</p>
                            <p className="text-sm font-bold text-foreground truncate tracking-tight">{resident.email}</p>
                        </div>
                    </div>
                </div>
              </section>

              {/* Mapped Assets - Standardized Flow */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                        <Home size={12} /> Connected Real Estate
                    </h3>
                    <Badge variant="neutral" className="bg-secondary text-[10px] font-black px-2 rounded-md">
                        {linkedFlats.length} UNITS
                    </Badge>
                </div>
                <div className="space-y-3">
                    {linkedFlats.map(flat => (
                        <div key={flat.id} className="p-5 rounded-2xl bg-secondary/20 border border-border/60 hover:bg-card hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all group flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-xl bg-foreground text-background flex items-center justify-center font-black text-sm shadow-lg group-hover:bg-primary transition-colors">
                                    #{flat.number}
                                </div>
                                <div>
                                    <p className="text-base font-black text-foreground tracking-tight leading-none mb-1.5 uppercase">Unit {flat.number}</p>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                        SEC-{flat.block} • {flat.unitType}
                                    </p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="rounded-xl text-[10px] font-black uppercase tracking-widest h-10 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all px-4 border-border/60">
                                View
                            </Button>
                        </div>
                    ))}
                </div>
              </section>

              {/* Family & Stakeholders */}
              <section className="p-6 rounded-2xl bg-secondary/10 border border-border/60 shadow-sm space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                    <Users size={12} /> Linked stakeholders
                </h3>
                <FamilyMemberList members={resident.familyMembers || []} />
              </section>

              {/* Protocol Metadata */}
              <section className="pt-6 border-t border-border/30">
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mb-2">Tenancy length</p>
                        <div className="flex items-center gap-2 text-xs font-black text-foreground uppercase tracking-tight">
                            <Calendar size={16} className="text-primary/40" />
                            Registered Q1 2024
                        </div>
                    </div>
                    <div>
                        <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mb-2">Validation Status</p>
                        <div className="flex items-center gap-2 text-xs font-black text-success uppercase tracking-tight">
                            <ShieldCheck size={16} className="text-success/40" />
                            KYC Verified
                        </div>
                    </div>
                 </div>
              </section>
            </div>

            {/* Sticky Professional Footer */}
            <div className="sticky bottom-0 p-6 bg-card border-t border-border flex gap-4">
              <Button variant="outline" className="flex-1 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] h-14 border-border/60">
                Audit Trail
              </Button>
              <Button className="flex-[1.5] rounded-xl font-black uppercase tracking-[0.2em] text-[10px] h-14 shadow-xl shadow-primary/20 bg-primary">
                Action Protocol
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
