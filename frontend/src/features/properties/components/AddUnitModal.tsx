'use client';

import { useState } from 'react';
import { Dialog, Button } from '@/components/ui';
import { UnitType } from '../types';
import { Building2, Hash, Layers, Home, Ruler } from 'lucide-react';

import { propertyApi } from '../api';
import { OccupancyStatus, MaintenanceRule, MaintenanceStatus } from '../types';

interface AddUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddUnitModal = ({ isOpen, onClose, onSuccess }: AddUnitModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    block: 'A',
    floor: '',
    number: '',
    unitType: UnitType.BHK_2,
    squareFeet: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await propertyApi.create({
        ...formData,
        floor: parseInt(formData.floor),
        squareFeet: parseInt(formData.squareFeet),
        occupancyStatus: OccupancyStatus.VACANT,
        maintenanceRule: MaintenanceRule.DEFAULT_OWNER,
        maintenanceStatus: MaintenanceStatus.PAID,
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to register unit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Register New Property Unit">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Building Block</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={16} />
              <input
                className="w-full bg-secondary/30 border border-border/60 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-4 focus:ring-primary/5 outline-none font-bold"
                value={formData.block}
                onChange={(e) => setFormData({ ...formData, block: e.target.value.toUpperCase() })}
                placeholder="A, B, C..."
                maxLength={2}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking_widest ml-1">Floor Level</label>
            <div className="relative">
              <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={16} />
              <input
                type="number"
                className="w-full bg-secondary/30 border border-border/60 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-4 focus:ring-primary/5 outline-none font-bold"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Unit / Flat Number</label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={16} />
            <input
              className="w-full bg-secondary/30 border border-border/60 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-4 focus:ring-primary/5 outline-none font-bold"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              placeholder="e.g. 101, 102..."
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Asset Configuration</label>
            <div className="relative">
              <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={16} />
              <select
                className="w-full bg-secondary/30 border border-border/60 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-4 focus:ring-primary/5 outline-none font-bold appearance-none cursor-pointer"
                value={formData.unitType}
                onChange={(e) => setFormData({ ...formData, unitType: e.target.value as UnitType })}
              >
                {Object.values(UnitType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Area (Sq. Ft.)</label>
            <div className="relative">
              <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={16} />
              <input
                type="number"
                className="w-full bg-secondary/30 border border-border/60 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-4 focus:ring-primary/5 outline-none font-bold"
                value={formData.squareFeet}
                onChange={(e) => setFormData({ ...formData, squareFeet: e.target.value })}
                placeholder="1200"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="flex-1 rounded-xl h-12 font-bold uppercase tracking-widest text-[10px]">
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
