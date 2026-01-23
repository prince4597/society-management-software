'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Building2, User, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input } from '@/components/ui';

const onboardSchema = z.object({
  society: z.object({
    name: z.string().trim().min(3, 'Society name must be at least 3 characters'),
    code: z
      .string()
      .trim()
      .min(2, 'Code must be at least 2 characters')
      .max(50, 'Code must be at most 50 characters')
      .regex(/^[A-Z0-9_-]+$/i, 'Only letters, numbers, hyphens, underscores allowed'),
    address: z.string().trim().min(10, 'Address must be at least 10 characters'),
    city: z.string().trim().min(2, 'City is required'),
    state: z.string().trim().min(2, 'State is required'),
    zipCode: z.string().trim().min(4, 'ZIP code is required'),
    email: z.string().trim().email('Invalid email').optional().or(z.literal('')),
    phone: z.string().trim().regex(/^\+\d{2}\s\d{10}$/, 'Format: +CC XXXXXXXXXX (e.g. +91 9876543210)').optional().or(z.literal('')),
    totalFlats: z.string().optional(),
  }),
  admin: z.object({
    firstName: z.string().trim().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().trim().min(2, 'Last name must be at least 2 characters'),
    email: z.string().trim().email('Invalid admin email'),
    phoneNumber: z.string().trim().regex(/^\+\d{2}\s\d{10}$/, 'Format: +CC XXXXXXXXXX (e.g. +91 9876543210)'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

type OnboardFormValues = z.infer<typeof onboardSchema>;

import { useOnboardSociety } from '../hooks/useOnboardSociety';

interface OnboardSocietyFormProps {
  onSuccess?: () => void;
}

export const OnboardSocietyForm = ({ onSuccess }: OnboardSocietyFormProps) => {
  const { onboard, formatPhone, isLoading, error, success } = useOnboardSociety(onSuccess);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<OnboardFormValues>({
    resolver: zodResolver(onboardSchema),
    defaultValues: {
      society: { totalFlats: '0' },
    },
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'society.phone' | 'admin.phoneNumber') => {
    setValue(field, formatPhone(e.target.value));
  };

  const onSubmit = async (data: OnboardFormValues) => {
    const res = await onboard(data);
    if (res.success) {
      reset();
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 workspace-shadow">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-primary/10 rounded-xl">
          <Building2 className="text-primary" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Onboard New Society</h2>
          <p className="text-sm text-muted-foreground">Create a society and its administrator</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" autoComplete="off" noValidate>
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-center gap-3 border border-destructive/20"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-success/10 text-success p-4 rounded-lg flex items-center gap-3 border border-success/20"
            >
              <CheckCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{success}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Society Details Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            <MapPin size={16} />
            <span>Society Details</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              {...register('society.name')}
              label="Society Name"
              placeholder="Green Valley Apartments"
              error={errors.society?.name?.message}
              disabled={isLoading}
              autoComplete="one-time-code"
              data-1p-ignore
            />
            <Input
              {...register('society.code')}
              label="Society Code"
              placeholder="GVA-001"
              error={errors.society?.code?.message}
              disabled={isLoading}
              autoComplete="one-time-code"
              data-1p-ignore
            />
          </div>

          <Input
            {...register('society.address')}
            label="Address"
            placeholder="123 Main Street, Block A"
            error={errors.society?.address?.message}
            disabled={isLoading}
            autoComplete="one-time-code"
            data-1p-ignore
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              {...register('society.city')}
              label="City"
              placeholder="Mumbai"
              error={errors.society?.city?.message}
              disabled={isLoading}
              autoComplete="one-time-code"
              data-1p-ignore
            />
            <Input
              {...register('society.state')}
              label="State"
              placeholder="Maharashtra"
              error={errors.society?.state?.message}
              disabled={isLoading}
              autoComplete="one-time-code"
              data-1p-ignore
            />
            <Input
              {...register('society.zipCode')}
              label="ZIP Code"
              placeholder="400001"
              error={errors.society?.zipCode?.message}
              disabled={isLoading}
              autoComplete="one-time-code"
              data-1p-ignore
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              {...register('society.email')}
              label="Society Email (Optional)"
              type="email"
              placeholder="contact@greenvalley.com"
              error={errors.society?.email?.message}
              disabled={isLoading}
              autoComplete="one-time-code"
              data-1p-ignore
            />
            <Input
              {...register('society.phone', { onChange: (e) => handlePhoneChange(e, 'society.phone') })}
              label="Society Phone (Optional)"
              placeholder="+91 0000000000"
              maxLength={14}
              error={errors.society?.phone?.message}
              disabled={isLoading}
              autoComplete="one-time-code"
              data-1p-ignore
            />
            <Input
              {...register('society.totalFlats')}
              label="Total Flats"
              type="number"
              placeholder="100"
              error={errors.society?.totalFlats?.message}
              disabled={isLoading}
              autoComplete="one-time-code"
              data-1p-ignore
            />
          </div>
        </div>

        {/* Admin Details Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            <User size={16} />
            <span>Society Admin Details</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              {...register('admin.firstName')}
              label="First Name"
              placeholder="John"
              error={errors.admin?.firstName?.message}
              disabled={isLoading}
              autoComplete="one-time-code"
              data-1p-ignore
            />
            <Input
              {...register('admin.lastName')}
              label="Last Name"
              placeholder="Doe"
              error={errors.admin?.lastName?.message}
              disabled={isLoading}
              autoComplete="one-time-code"
              data-1p-ignore
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              {...register('admin.email')}
              label="Admin Email"
              type="email"
              placeholder="admin@greenvalley.com"
              error={errors.admin?.email?.message}
              disabled={isLoading}
              autoComplete="one-time-code"
              data-1p-ignore
            />
            <Input
              {...register('admin.phoneNumber', { onChange: (e) => handlePhoneChange(e, 'admin.phoneNumber') })}
              label="Admin Phone"
              placeholder="+91 0000000000"
              maxLength={14}
              error={errors.admin?.phoneNumber?.message}
              disabled={isLoading}
              autoComplete="one-time-code"
              data-1p-ignore
            />
          </div>

          <Input
            {...register('admin.password')}
            label="Admin Password"
            type="password"
            placeholder="••••••••"
            error={errors.admin?.password?.message}
            disabled={isLoading}
            autoComplete="new-password"
            data-1p-ignore
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={() => reset()} disabled={isLoading}>
            Reset
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Onboard Society
          </Button>
        </div>
      </form>
    </div>
  );
};
