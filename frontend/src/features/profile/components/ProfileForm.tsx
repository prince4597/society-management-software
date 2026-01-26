'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Phone, Save, Loader2, CheckCircle2, LucideIcon } from 'lucide-react';
import { formatPhoneNumber } from '@/infrastructure/utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui';
import { authService } from '@/features/auth';
import { useAuth } from '@/providers/AuthProvider';
import { cn } from '@/lib/utils';

import { VALIDATION } from '@/infrastructure/utils/validation';

const profileSchema = z.object({
  firstName: VALIDATION.NAME_MIN(2),
  lastName: VALIDATION.NAME_MIN(2),
  phoneNumber: VALIDATION.PHONE,
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  mode?: 'view' | 'edit';
  onCancel?: () => void;
  onSuccess?: () => void;
}

const ReadOnlyValue = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) => (
  <div className="space-y-1.5 flex flex-col">
    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest ml-0.5">
      {label}
    </span>
    <div className="h-11 px-4 flex items-center gap-3 bg-secondary/10 border border-border/40 rounded-xl text-xs font-semibold text-foreground/80">
      <Icon size={14} className="text-primary/60" />
      {value || '---'}
    </div>
  </div>
);

export const ProfileForm = ({ mode = 'edit', onCancel, onSuccess }: ProfileFormProps) => {
  const { user, refreshUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const isViewMode = mode === 'view';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: (user?.firstName || '').trim(),
      lastName: (user?.lastName || '').trim(),
      phoneNumber: (user?.phoneNumber || '').trim(),
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName.trim(),
        lastName: user.lastName.trim(),
        phoneNumber: user.phoneNumber?.trim() || '',
      });
    }
  }, [user, reset]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('phoneNumber', formatPhoneNumber(e.target.value));
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    setStatus('idle');
    try {
      const res = await authService.updateProfile(data);
      if (res.success) {
        await refreshUser();
        setStatus('success');
        onSuccess?.();
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" autoComplete="off" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isViewMode ? (
          <>
            <ReadOnlyValue label="First Name" value={user?.firstName || ''} icon={User} />
            <ReadOnlyValue label="Last Name" value={user?.lastName || ''} icon={User} />
          </>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground ml-1">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <input
                  {...register('firstName')}
                  autoComplete="one-time-code"
                  data-1p-ignore
                  data-lpignore="true"
                  className={cn(
                    'w-full bg-secondary/20 border border-border/50 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:bg-background focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all outline-none',
                    errors.firstName && 'border-destructive/50 focus:ring-destructive/10'
                  )}
                  placeholder="First Name"
                />
              </div>
              {errors.firstName && (
                <p className="text-[10px] font-medium text-destructive ml-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground ml-1">Last Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <input
                  {...register('lastName')}
                  autoComplete="one-time-code"
                  data-1p-ignore
                  data-lpignore="true"
                  className={cn(
                    'w-full bg-secondary/20 border border-border/50 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:bg-background focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all outline-none',
                    errors.lastName && 'border-destructive/50 focus:ring-destructive/10'
                  )}
                  placeholder="Last Name"
                />
              </div>
              {errors.lastName && (
                <p className="text-[10px] font-medium text-destructive ml-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </>
        )}
      </div>

      <div className="space-y-2">
        {isViewMode ? (
          <ReadOnlyValue label="Phone Number" value={user?.phoneNumber || ''} icon={Phone} />
        ) : (
          <>
            <label className="text-xs font-semibold text-muted-foreground ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
              <input
                {...register('phoneNumber', { onChange: handlePhoneChange })}
                autoComplete="one-time-code"
                data-1p-ignore
                data-lpignore="true"
                maxLength={14}
                className={cn(
                  'w-full bg-secondary/20 border border-border/50 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:bg-background focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all outline-none',
                  errors.phoneNumber && 'border-destructive/50 focus:ring-destructive/10'
                )}
                placeholder="+91 0000000000"
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-[10px] font-medium text-destructive ml-1">
                {errors.phoneNumber.message}
              </p>
            )}
          </>
        )}
      </div>

      {!isViewMode && (
        <div className="flex items-center gap-3 pt-6 border-t border-border/40">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 rounded-xl hover:bg-secondary/20 transition-all font-semibold"
          >
            Discard
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 px-8 rounded-xl font-bold text-sm gap-2 shadow-lg shadow-primary/10 transition-all active:scale-95"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </Button>

          <AnimatePresence>
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-success font-semibold text-xs ml-auto"
              >
                <CheckCircle2 size={16} />
                Profile Updated
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </form>
  );
};
