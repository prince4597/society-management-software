'use client';

import { Users, Building2, Wallet, Shield } from 'lucide-react';
import { StatCard } from './StatCard';

const stats = [
  { label: 'Active Residences', value: '1,280', growth: '+12%', icon: Building2, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Total Occupancy', value: '94.2%', growth: '+2.4%', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { label: 'Revenue Collection', value: '₹42.8L', growth: '+14%', icon: Wallet, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { label: 'Staff On-Duty', value: '24', growth: 'Full', icon: Shield, color: 'text-amber-500', bg: 'bg-amber-500/10' },
];

export const StatsGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={stat.label} {...stat} index={index} />
      ))}
    </div>
  );
};
