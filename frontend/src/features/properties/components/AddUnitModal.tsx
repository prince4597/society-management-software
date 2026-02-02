'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, Button, Input } from '@/components/ui';
import { UnitType, OccupancyStatus, MaintenanceRule, MaintenanceStatus } from '../types';
import { Building2, Hash, Layers, Home, Ruler } from 'lucide-react';
import { propertyApi } from '../api';

const unitSchema = z.object({
  block: z.string().min(1, 'Block is required').max(10).toUpperCase(),
  floor: z.number().int('Floor must be an integer'),
  number: z.string().min(1, 'Unit number is required'),
  unitType: z.nativeEnum(UnitType),
  squareFeet: z.number().positive('Square feet must be positive'),
});

type UnitFormValues = z.infer<typeof unitSchema>;

interface AddUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddUnitModal = ({ isOpen, onClose, onSuccess }: AddUnitModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UnitFormValues>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      block: 'A',
      unitType: UnitType.BHK_2,
    },
  });

  const onSubmit = async (data: UnitFormValues) => {
    try {
      setIsSubmitting(true);
      await propertyApi.create({
        ...data,
        occupancyStatus: OccupancyStatus.VACANT,
        maintenanceRule: MaintenanceRule.DEFAULT_OWNER,
        maintenanceStatus: MaintenanceStatus.PAID,
      });
      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error('Failed to register unit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} title="Register New Property Unit">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input
            {...register('block')}
            label="Building Block"
            placeholder="A, B, C..."
            leftIcon={<Building2 size={16} />}
            error={errors.block?.message}
            maxLength={2}
          />
          <Input
            {...register('floor', { valueAsNumber: true })}
            type="number"
            label="Floor Level"
            placeholder="0"
            leftIcon={<Layers size={16} />}
            error={errors.floor?.message}
          />
        </div>

        <Input
          {...register('number')}
          label="Unit / Flat Number"
          placeholder="e.g. 101, 102..."
          leftIcon={<Hash size={16} />}
          error={errors.number?.message}
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-0.5">Asset Configuration</label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                <Home size={16} />
              </div>
              <select
                {...register('unitType')}
                className="w-full bg-input border border-border rounded-md pl-9 h-9 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary appearance-none cursor-pointer font-bold"
              >
                {Object.values(UnitType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          <Input
            {...register('squareFeet', { valueAsNumber: true })}
            type="number"
            label="Area (Sq. Ft.)"
            placeholder="1200"
            leftIcon={<Ruler size={16} />}
            error={errors.squareFeet?.message}
          />
        </div>

        <div className="pt-4 flex gap-3">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting} className="flex-1 rounded-xl h-12 font-bold uppercase tracking-widest text-[10px]">
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting} className="flex-1 rounded-xl h-12 font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
            Confirm Entry
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
