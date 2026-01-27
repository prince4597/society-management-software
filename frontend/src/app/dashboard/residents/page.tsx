'use client';

import { useState, useEffect } from 'react';
// import { MOCK_RESIDENTS, MOCK_FLATS } from '@/features/properties/data/mockData';
import { Resident, ResidentRole } from '@/features/residents/types';
import { Flat } from '@/features/properties/types';
import { residentApi } from '@/features/residents/api';
import { propertyApi } from '@/features/properties/api';
import { ResidentProfileDrawer } from '@/features/residents/components/ResidentProfileDrawer';
import { RegisterMemberModal } from '@/features/residents/components/RegisterMemberModal';
import {
  Users,
  Search,
  Filter,
  MapPin,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  Building,
  Home,
  Loader2
} from 'lucide-react';
import {
  Button,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui';
import { OwnerBadge, TenantBadge, FamilyBadge } from '@/features/residents/components/ResidentBadges';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function ResidentsPage() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [flats, setFlats] = useState<Flat[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [residentsData, flatsData] = await Promise.all([
        residentApi.findAll(),
        propertyApi.findAll(),
      ]);
      setResidents(residentsData);
      setFlats(flatsData);
    } catch (error) {
      console.error('Failed to fetch residents data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  function getFlatNumbers(resident: Resident) {
    const ids = [
      ...(resident.flatIds || []),
      ...(resident.ownedProperties?.map(p => p.id) || []),
      ...(resident.rentedProperties?.map(p => p.id) || [])
    ];
    const uniqueIds = Array.from(new Set(ids));
    if (uniqueIds.length === 0) return '';
    return uniqueIds.map(id => flats.find(f => f.id === id)?.number).filter(Boolean).join(', ');
  }

  const filteredResidents = residents.filter(r =>
    `${r.firstName} ${r.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getFlatNumbers(r).includes(searchQuery)
  );

  const handleResidentClick = (resident: Resident) => {
    setSelectedResident(resident);
    setIsDrawerOpen(true);
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-12">
      {/* ERP Native Header Pattern - Unified */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-card p-10 rounded-2xl border border-border shadow-sm overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -mr-16 -mt-16 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Badge
                variant="neutral"
                className="bg-secondary/80 text-muted-foreground border-border/50 font-bold uppercase tracking-[0.2em] text-[10px] px-2.5 h-6 rounded-lg"
              >
                Resident Registry
              </Badge>
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            </div>
            <h1 className="text-4xl font-black text-foreground tracking-tight leading-tight">
              Community <span className="text-primary italic font-serif">Directory</span>
            </h1>
            <p className="text-sm text-muted-foreground font-medium mt-2 max-w-md">
              High-fidelity ledger of all verified homeowners, tenants, and community stakeholders.
            </p>
          </div>

          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-[1.5rem] font-black gap-3 shadow-xl shadow-primary/20 h-16 px-10 text-[10px] uppercase tracking-[0.2em] bg-primary hover:scale-[1.02] active:scale-95 transition-all"
          >
            <UserPlus size={22} />
            Register Member
          </Button>
        </div>
      </motion.div>

      {/* High-Impact Analytics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Verified', value: residents.filter(r => r.isResident).length, icon: ShieldCheck, color: 'text-success', bg: 'bg-success/5' },
          { label: 'Unit Owners', value: residents.filter(r => r.role === ResidentRole.PRIMARY_OWNER).length, icon: Building, color: 'text-primary', bg: 'bg-primary/5' },
          { label: 'Lease Holders', value: residents.filter(r => r.role === ResidentRole.TENANT).length, icon: Users, color: 'text-info', bg: 'bg-info/5' },
          { label: 'Absentee', value: residents.filter(r => !r.isResident).length, icon: MapPin, color: 'text-warning', bg: 'bg-warning/5' },
        ].map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className="bg-card border border-border/60 p-6 rounded-2xl flex flex-col gap-4 shadow-sm hover:border-primary/20 transition-all group"
          >
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-transform group-hover:scale-110", stat.bg, stat.color, "border-inherit")}>
              <stat.icon size={20} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-1.5">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black text-foreground tracking-tighter">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Unified Search & Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-card border border-border p-4 rounded-[2rem] shadow-sm">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search Member Registry..."
            className="w-full bg-secondary/20 border border-transparent focus:border-primary/10 rounded-[1.25rem] py-3.5 pl-14 pr-8 text-sm font-bold text-foreground focus:ring-8 focus:ring-primary/5 transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none rounded-2xl font-black gap-3 text-[10px] uppercase tracking-widest h-14 px-8 border-border/60 hover:bg-secondary">
            <Filter size={18} /> Filters
          </Button>
        </div>
      </div>

      {/* Professional Registry Ledger */}
      <div className="bg-card border border-border/60 rounded-[2rem] overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/20 hover:bg-secondary/20 border-b border-border">
              <TableHead className="w-[350px] text-[10px] font-black uppercase tracking-[0.2em] h-14 pl-8 text-muted-foreground/60">Entity Identity</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-center text-muted-foreground/60">Classification</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-center text-muted-foreground/60">Mapped Assets</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-center text-muted-foreground/60">Premise Status</TableHead>
              <TableHead className="text-right text-[10px] font-black uppercase tracking-[0.2em] pr-10 text-muted-foreground/60">Protocol</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResidents.map((resident) => (
              <TableRow
                key={resident.id}
                onClick={() => handleResidentClick(resident)}
                className="group cursor-pointer transition-all hover:bg-secondary/30 border-b border-border/40 last:border-0"
              >
                <TableCell className="py-6 pl-8">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-foreground text-background flex items-center justify-center font-black text-xl transition-all group-hover:bg-primary group-hover:scale-105 shadow-sm">
                      {resident.firstName[0]}
                    </div>
                    <div>
                      <p className="font-black text-lg text-foreground tracking-tight uppercase leading-none mb-1.5">{resident.firstName} {resident.lastName}</p>
                      <p className="text-[10px] text-muted-foreground font-bold tracking-widest">
                        {resident.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    {resident.role === ResidentRole.PRIMARY_OWNER && <OwnerBadge />}
                    {resident.role === ResidentRole.TENANT && <TenantBadge />}
                    {resident.role === ResidentRole.FAMILY_MEMBER && <FamilyBadge />}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-xl bg-secondary/50 border border-border/60 text-[10px] font-black text-foreground group-hover:border-primary/20 transition-colors">
                    <Home size={14} className="text-primary/40" /> Unit {getFlatNumbers(resident)}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={resident.isResident ? 'success' : 'warning'}
                    className="text-[9px] font-black rounded-lg px-3 py-1 uppercase tracking-widest border-0"
                  >
                    {resident.isResident ? "Verified In" : "Absent"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-10">
                  <div className="flex justify-end">
                    <div className="w-12 h-12 rounded-2xl bg-secondary/40 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all shadow-sm border border-border/60 group-hover:border-primary group-hover:scale-110">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ResidentProfileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        resident={selectedResident}
        flats={flats}
        allResidents={residents}
      />

      <RegisterMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
}
