'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Building2, MapPin, AlertCircle, CheckCircle, Save, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input } from '@/components/ui';
import { useSocietyProfile } from '../hooks/useSocietyProfile';
import { VALIDATION } from '@/infrastructure/utils/validation';

const societyProfileSchema = z.object({
  name: VALIDATION.NAME_MIN(3),
  address: z.string().trim().min(10, 'Address must be at least 10 characters'),
  city: VALIDATION.NAME_MIN(2),
  state: VALIDATION.NAME_MIN(2),
  zipCode: z.string().trim().min(4, 'ZIP code is required'),
  email: VALIDATION.EMAIL_OPTIONAL,
  phone: VALIDATION.PHONE_OPTIONAL,
  totalFlats: z.string().optional(),
});

type SocietyProfileFormValues = z.infer<typeof societyProfileSchema>;

interface SocietyProfileFormProps {
  mode?: 'view' | 'edit';
  onCancel?: () => void;
  onSuccess?: () => void;
}

const ReadOnlyValue = ({ label, value }: { label: string; value: string | number }) => (
  <div className="space-y-1.5 flex flex-col">
    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest ml-0.5">
      {label}
    </span>
    <div className="h-10 px-4 flex items-center bg-secondary/10 border border-border/40 rounded-xl text-xs font-semibold text-foreground/80">
      {value || '---'}
    </div>
  </div>
);

export const SocietyProfileForm = ({
  mode = 'edit',
  onCancel,
  onSuccess,
}: SocietyProfileFormProps) => {
  const { society, isLoading, isUpdating, error, success, updateProfile, formatPhone } =
    useSocietyProfile();
  const isViewMode = mode === 'view';

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SocietyProfileFormValues>({
    resolver: zodResolver(societyProfileSchema),
  });

  useEffect(() => {
    if (society) {
      reset({
        name: society.name,
        address: society.address,
        city: society.city,
        state: society.state,
        zipCode: society.zipCode,
        email: society.email || '',
        phone: society.phone || '',
        totalFlats: String(society.totalFlats),
      });
    }
  }, [society, reset]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('phone', formatPhone(e.target.value));
  };

  const onSubmit = async (data: SocietyProfileFormValues) => {
    const totalFlatsVal = parseInt(data.totalFlats || '0', 10);
    const payload = {
      ...data,
      totalFlats: isNaN(totalFlatsVal) ? 0 : totalFlatsVal,
    };
    const res = await updateProfile(payload as unknown as Partial<import('@/types').Society>);
    if (res.success) {
      onSuccess?.();
    }
  };

  if (isLoading && !society) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading society technical parameters...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-destructive/10 text-destructive p-4 rounded-xl flex items-center gap-3 border border-destructive/20"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-success/10 text-success p-4 rounded-xl flex items-center gap-3 border border-success/20"
          >
            <CheckCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{success}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" autoComplete="off" noValidate>
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
            <Building2 size={14} className="text-primary/60" />
            <span>Core Identity</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isViewMode ? (
              <>
                <ReadOnlyValue label="Entity Name" value={society?.name || ''} />
                <ReadOnlyValue label="Registry Code" value={society?.code || ''} />
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground ml-1">
                    Entity Name
                  </label>
                  <Input
                    {...register('name')}
                    placeholder="Society Name"
                    className="bg-secondary/20 border-border/50 focus:bg-background transition-all"
                    error={errors.name?.message}
                    disabled={isUpdating}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground ml-1">
                    Registry Code
                  </label>
                  <Input
                    value={society?.code}
                    disabled
                    className="bg-secondary/10 border-border/30 text-muted-foreground cursor-not-allowed opacity-70"
                    label=""
                  />
                  <p className="text-[10px] text-muted-foreground/60 ml-1 italic">
                    Internal identifier cannot be modified
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="space-y-6 pt-2">
          <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
            <MapPin size={14} className="text-primary/60" />
            <span>Geospatial Records</span>
          </div>

          {isViewMode ? (
            <div className="space-y-6">
              <ReadOnlyValue label="Registered Address" value={society?.address || ''} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ReadOnlyValue label="City" value={society?.city || ''} />
                <ReadOnlyValue label="State" value={society?.state || ''} />
                <ReadOnlyValue label="Postal Code" value={society?.zipCode || ''} />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground ml-1">
                  Registered Address
                </label>
                <Input
                  {...register('address')}
                  placeholder="123 Main Street, Block A"
                  className="bg-secondary/20 border-border/50 focus:bg-background transition-all"
                  error={errors.address?.message}
                  disabled={isUpdating}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground ml-1">City</label>
                  <Input
                    {...register('city')}
                    placeholder="City"
                    className="bg-secondary/20 border-border/50 focus:bg-background transition-all"
                    error={errors.city?.message}
                    disabled={isUpdating}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground ml-1">State</label>
                  <Input
                    {...register('state')}
                    placeholder="State"
                    className="bg-secondary/20 border-border/50 focus:bg-background transition-all"
                    error={errors.state?.message}
                    disabled={isUpdating}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground ml-1">
                    Postal Code
                  </label>
                  <Input
                    {...register('zipCode')}
                    placeholder="ZIP Code"
                    className="bg-secondary/20 border-border/50 focus:bg-background transition-all"
                    error={errors.zipCode?.message}
                    disabled={isUpdating}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6 pt-2">
          <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
            <Building2 size={14} className="text-primary/60" />
            <span>Operational Metadata</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isViewMode ? (
              <>
                <ReadOnlyValue label="Official Email" value={society?.email || ''} />
                <ReadOnlyValue label="Primary Phone" value={society?.phone || ''} />
                <ReadOnlyValue label="Total Flat Inventory" value={society?.totalFlats || 0} />
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground ml-1">
                    Official Email
                  </label>
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="contact@society.com"
                    className="bg-secondary/20 border-border/50 focus:bg-background transition-all"
                    error={errors.email?.message}
                    disabled={isUpdating}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground ml-1">
                    Primary Phone
                  </label>
                  <Input
                    {...register('phone', { onChange: handlePhoneChange })}
                    placeholder="+91 0000000000"
                    maxLength={14}
                    className="bg-secondary/20 border-border/50 focus:bg-background transition-all"
                    error={errors.phone?.message}
                    disabled={isUpdating}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground ml-1">
                    Total Flat Inventory
                  </label>
                  <Input
                    {...register('totalFlats')}
                    type="number"
                    placeholder="0"
                    className="bg-secondary/20 border-border/50 focus:bg-background transition-all"
                    error={errors.totalFlats?.message}
                    disabled={isUpdating}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {!isViewMode && (
          <div className="flex items-center justify-end gap-3 pt-6 mt-4 border-t border-border/50">
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isUpdating}
              className="px-6 rounded-xl hover:bg-secondary/20 transition-all font-semibold"
            >
              Discard
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              className="h-11 px-8 rounded-xl font-bold text-sm gap-2 shadow-lg shadow-primary/10 active:scale-95 transition-all"
            >
              {isUpdating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Synchronizing...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};
