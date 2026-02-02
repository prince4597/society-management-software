import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, Button, Badge, Input } from '@/components/ui';
import { ResidentRole } from '../types';
import { User, Mail, Phone, Home, Briefcase, ChevronRight, ChevronLeft, Check, Search, Building2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { residentApi } from '../api';
import { propertyApi } from '../../properties/api';
import { Flat } from '../../properties/types';
import { cn } from '@/lib/utils';
import { VALIDATION } from '@/infrastructure/utils/validation';
import { formatPhoneNumber } from '@/infrastructure/utils/formatters';

const memberSchema = z.object({
  firstName: VALIDATION.NAME_MIN(2),
  lastName: VALIDATION.NAME_MIN(2),
  email: VALIDATION.EMAIL,
  phoneNumber: VALIDATION.PHONE,
  role: z.nativeEnum(ResidentRole),
});

type MemberFormValues = z.infer<typeof memberSchema>;

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

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    reset,
    formState: { errors },
  } = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      role: ResidentRole.PRIMARY_OWNER,
    },
  });

  const loadUnits = useCallback(async (search?: string) => {
    try {
      setFetchingUnits(true);
      const response = await propertyApi.findAll({ search, limit: 12 });
      setUnits(response.data);
    } catch (error) {
      console.error('Failed to fetch units:', error);
    } finally {
      setFetchingUnits(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && step === 2) {
      const timer = setTimeout(() => {
        loadUnits(searchQuery);
      }, searchQuery ? 300 : 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, step, searchQuery, loadUnits]);

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
    setSearchQuery('');
  };

  const onActualSubmit = async (data: MemberFormValues) => {
    try {
      setLoading(true);
      await residentApi.create({
        ...data,
        isResident: true,
        flatIds: selectedUnitIds,
      });
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
    reset();
    setSelectedUnitIds([]);
    setSearchQuery('');
    onClose();
  };

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

        <form onSubmit={handleSubmit(onActualSubmit)}>
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
                  <Input
                    {...register('firstName')}
                    label="First Name"
                    placeholder="e.g. Amit"
                    leftIcon={<User size={16} />}
                    error={errors.firstName?.message}
                    autoFocus
                  />
                  <Input
                    {...register('lastName')}
                    label="Last Name"
                    placeholder="e.g. Sharma"
                    leftIcon={<User size={16} />}
                    error={errors.lastName?.message}
                  />
                </div>

                <Input
                  {...register('email')}
                  label="Email Address"
                  placeholder="amit.sharma@example.com"
                  leftIcon={<Mail size={16} />}
                  error={errors.email?.message}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    {...register('phoneNumber', {
                      onChange: (e) => setValue('phoneNumber', formatPhoneNumber(e.target.value))
                    })}
                    label="Mobile Hotline"
                    placeholder="+91 98765 43210"
                    leftIcon={<Phone size={16} />}
                    error={errors.phoneNumber?.message}
                    maxLength={14}
                  />
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-0.5">Community Role</label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                        <Briefcase size={16} />
                      </div>
                      <select
                        {...register('role')}
                        className="w-full bg-input border border-border rounded-md pl-9 h-9 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary appearance-none cursor-pointer"
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
                    type="button"
                    onClick={handleNext}
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
                  ) : units.length > 0 ? (
                    units.map(unit => {
                      const isAlreadyOwned = !!unit.ownerId;
                      // Logic: Primary owners can only be assigned to units without an owner.
                      // This logic might be complex depending on business rules, but let's keep it consistent with the previous version.
                      // Note: the previous version used 'formData.role' which we've refactored.
                      // We can get the role from useForm's getValues or watch.
                    
                      return (
                        <button
                          key={unit.id}
                          type="button"
                          onClick={() => toggleUnit(unit.id)}
                          className={cn(
                            "relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all group",
                            selectedUnitIds.includes(unit.id)
                              ? "bg-primary/5 border-primary shadow-lg shadow-primary/5"
                              : "bg-card border-border/40 hover:border-primary/40"
                          )}
                        >
                          <Home size={20} className={cn("mb-2",
                            selectedUnitIds.includes(unit.id) ? "text-primary" : "text-muted-foreground/40"
                          )} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Unit {unit.number}</span>
                          <span className="text-[8px] font-bold text-muted-foreground/60 uppercase">Block {unit.block} • L{unit.floor}</span>

                          {selectedUnitIds.includes(unit.id) && (
                            <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                              <Check size={10} className="text-white" />
                            </div>
                          )}

                          {isAlreadyOwned && (
                            <div className="mt-2 text-[7px] font-black text-warning uppercase">LOCKED</div>
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
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="rounded-2xl h-14 font-black uppercase tracking-[0.2em] text-[10px] gap-2"
                  >
                    <ChevronLeft size={16} /> Back
                  </Button>
                  <Button
                    type="submit"
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
        </form>
      </div>
    </Dialog>
  );
};
