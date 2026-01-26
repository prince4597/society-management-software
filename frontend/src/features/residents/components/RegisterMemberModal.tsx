'use client';

import { useState } from 'react';
import { Dialog, Button } from '@/components/ui';
import { ResidentRole } from '../types';
import { User, Mail, Phone, Shield, Home, Briefcase } from 'lucide-react';

interface RegisterMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterMemberModal = ({ isOpen, onClose }: RegisterMemberModalProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: ResidentRole.PRIMARY_OWNER,
    unitNumbers: '', // comma separated flat numbers
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Member Data:', formData);
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Register Community Member">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">First Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={16} />
              <input 
                className="w-full bg-secondary/30 border border-border/60 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-4 focus:ring-primary/5 outline-none font-bold"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Amit"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Last Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={16} />
              <input 
                className="w-full bg-secondary/30 border border-border/60 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-4 focus:ring-primary/5 outline-none font-bold"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Sharma"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={16} />
            <input 
              type="email"
              className="w-full bg-secondary/30 border border-border/60 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-4 focus:ring-primary/5 outline-none font-bold"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="amit.sharma@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Mobile Hotline</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={16} />
            <input 
              className="w-full bg-secondary/30 border border-border/60 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-4 focus:ring-primary/5 outline-none font-bold"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="+91 98765-43210"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Membership Role</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={16} />
              <select 
                className="w-full bg-secondary/30 border border-border/60 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-4 focus:ring-primary/5 outline-none font-bold appearance-none cursor-pointer"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as ResidentRole })}
              >
                {Object.values(ResidentRole).map(role => (
                  <option key={role} value={role}>{role.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Assigned Units</label>
            <div className="relative">
              <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={16} />
              <input 
                className="w-full bg-secondary/30 border border-border/60 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-4 focus:ring-primary/5 outline-none font-bold"
                value={formData.unitNumbers}
                onChange={(e) => setFormData({ ...formData, unitNumbers: e.target.value })}
                placeholder="101, 402..."
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex gap-3">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl h-12 font-bold uppercase tracking-widest text-[10px]">
            Cancel
          </Button>
          <Button type="submit" className="flex-1 rounded-xl h-12 font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
            Finalize Registry
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
