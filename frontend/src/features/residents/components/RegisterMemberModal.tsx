import { useState, useEffect, useCallback } from 'react';
import { Dialog, Button, Badge } from '@/components/ui';
import { ResidentRole } from '../types';
import { User, Mail, Phone, Home, Briefcase, ChevronRight, ChevronLeft, Check, Search, Building2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { residentApi } from '../api';
import { propertyApi } from '../../properties/api';
import { Flat, OccupancyStatus } from '../../properties/types';
import { cn } from '@/lib/utils';

interface RegisterMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RegisterMemberModal = ({ isOpen, onClose, onSuccess }: RegisterMemberModalProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchingUnits, setFetchingUnits] = useState(false);
  const [units, setUnits] = useState<Flat[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: ResidentRole.PRIMARY_OWNER,
  });

  const loadUnits = useCallback(async () => {
    try {
      setFetchingUnits(true);
      const data = await propertyApi.findAll();
      setUnits(data);
    } catch (error) {
      console.error('Failed to fetch units:', error);
    } finally {
      setFetchingUnits(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && step === 2 && units.length === 0) {
      loadUnits();
    }
  }, [isOpen, step, units.length, loadUnits]);

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // 1. Create the resident
      const newResident = await residentApi.create({
        ...formData,
        isResident: true,
        flatIds: selectedUnitIds,
      });

      // 2. Link selected units (only for Primary roles)
      const isPrimaryRole = formData.role === ResidentRole.PRIMARY_OWNER || formData.role === ResidentRole.TENANT;
      if (selectedUnitIds.length > 0 && isPrimaryRole) {
        const updateData: Partial<Flat> = {
          occupancyStatus: formData.role === ResidentRole.TENANT
            ? OccupancyStatus.RENTED
            : OccupancyStatus.OWNER_OCCUPIED,
        };

        // Assign to the correct role field
        if (formData.role === ResidentRole.TENANT) {
          updateData.tenantId = newResident.id;
        } else {
          updateData.ownerId = newResident.id;
        }

        await Promise.all(
          selectedUnitIds.map(unitId => propertyApi.update(unitId, updateData))
        );
      }

      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Failed to register member:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      role: ResidentRole.PRIMARY_OWNER,
    });
    setSelectedUnitIds([]);
    onClose();
  };

  const filteredUnits = units.filter(u =>
    u.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.block.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUnit = (id: string) => {
    setSelectedUnitIds(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 1 ? "Member Profile" : "Unit Allocation"}
      className="max-w-2xl"
    >
      <div className="relative overflow-hidden">
        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-8 px-1">
          <div className={cn("h-1.5 flex-1 rounded-full transition-all duration-500", step >= 1 ? "bg-primary" : "bg-secondary")} />
          <div className={cn("h-1.5 flex-1 rounded-full transition-all duration-500", step >= 2 ? "bg-primary" : "bg-secondary")} />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/30" size={16} />
                    <input
                      autoFocus
                      className="w-full bg-secondary/20 border border-border/40 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-4 focus:ring-primary/5 outline-none font-bold transition-all"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="e.g. Amit"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/30" size={16} />
                    <input
                      className="w-full bg-secondary/20 border border-border/40 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-4 focus:ring-primary/5 outline-none font-bold transition-all"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="e.g. Sharma"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/30" size={16} />
                  <input
                    type="email"
                    className="w-full bg-secondary/20 border border-border/40 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-4 focus:ring-primary/5 outline-none font-bold transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="amit.sharma@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Mobile Hotline</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/30" size={16} />
                    <input
                      className="w-full bg-secondary/20 border border-border/40 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-4 focus:ring-primary/5 outline-none font-bold transition-all"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="+91 98765-43210"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Community Role</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/30" size={16} />
                    <select
                      id="role-select"
                      aria-label="Community Role"
                      className="w-full bg-secondary/20 border border-border/40 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-4 focus:ring-primary/5 outline-none font-bold appearance-none cursor-pointer"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as ResidentRole })}
                    >
                      {Object.values(ResidentRole).map(role => (
                        <option key={role} value={role}>{role.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleNext}
                  disabled={!formData.firstName || !formData.email}
                  className="w-full rounded-2xl h-14 font-black uppercase tracking-[0.2em] text-[10px] gap-2 shadow-xl shadow-primary/20"
                >
                  Continue to Selection <ChevronRight size={16} />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-secondary/10 p-4 rounded-2xl border border-border/40 flex items-center gap-4">
                <Search className="text-muted-foreground" size={18} />
                <input
                  autoFocus
                  placeholder="Search by Unit # or Block..."
                  className="bg-transparent border-none outline-none text-sm font-bold flex-1"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Badge variant="neutral" className="bg-secondary/50 font-black">{selectedUnitIds.length} Selected</Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {fetchingUnits ? (
                  <div className="col-span-3 py-10 flex flex-col items-center gap-3 text-muted-foreground">
                    <Loader2 className="animate-spin" size={32} />
                    <p className="text-[10px] font-bold uppercase tracking-widest">Inventory Cataloging...</p>
                  </div>
                ) : filteredUnits.length > 0 ? (
                  filteredUnits.map(unit => {
                    const isAlreadyOwned = !!unit.ownerId;
                    const isDisabled = formData.role === ResidentRole.PRIMARY_OWNER && isAlreadyOwned;

                    return (
                      <button
                        key={unit.id}
                        onClick={() => !isDisabled && toggleUnit(unit.id)}
                        disabled={isDisabled}
                        className={cn(
                          "relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all group",
                          selectedUnitIds.includes(unit.id)
                            ? "bg-primary/5 border-primary shadow-lg shadow-primary/5"
                            : isDisabled
                              ? "bg-secondary/5 border-border/20 opacity-60 cursor-not-allowed"
                              : "bg-card border-border/40 hover:border-primary/40"
                        )}
                      >
                        <Home size={20} className={cn("mb-2",
                          selectedUnitIds.includes(unit.id) ? "text-primary" :
                            isDisabled ? "text-muted-foreground/20" : "text-muted-foreground/40"
                        )} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Unit {unit.number}</span>
                        <span className="text-[8px] font-bold text-muted-foreground/60 uppercase">Block {unit.block} • L{unit.floor}</span>

                        {selectedUnitIds.includes(unit.id) && (
                          <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                            <Check size={10} className="text-white" />
                          </div>
                        )}

                        {isDisabled && (
                          <div className="mt-2">
                            <Badge variant="neutral" className="bg-secondary/80 text-[7px] font-black px-1.5 py-0 rounded-md border-0 text-muted-foreground">
                              OWNED
                            </Badge>
                          </div>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="col-span-3 py-10 flex flex-col items-center gap-3 text-muted-foreground">
                    <Building2 size={32} className="opacity-20" />
                    <p className="text-[10px] font-bold uppercase tracking-widest">No Matches Found</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="rounded-2xl h-14 font-black uppercase tracking-[0.2em] text-[10px] gap-2"
                >
                  <ChevronLeft size={16} /> Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  isLoading={loading}
                  disabled={selectedUnitIds.length === 0}
                  className="rounded-2xl h-14 font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20"
                >
                  Finalize Registry
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Dialog>
  );
};
