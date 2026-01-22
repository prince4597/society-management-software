'use client';

import { Users, Building2, Wallet, Shield } from 'lucide-react';
import { StatCard } from './StatCard';

const stats = [
  { label: 'Active Residences', value: '1,280', growth: '+12%', icon: Building2, color: 'primary' },
  { label: 'Total Occupancy', value: '94.2%', growth: '+2.4%', icon: Users, color: 'blue' },
  { label: 'Revenue Collection', value: '₹42.8L', growth: '+14%', icon: Wallet, color: 'success' },
  { label: 'Staff On-Duty', value: '24', growth: 'Full', icon: Shield, color: 'warning' },
];

const colorMap = {
  primary: { text: 'text-primary', bg: 'bg-primary/10' },
  blue: { text: 'text-blue-500', bg: 'bg-blue-500/10' },
  success: { text: 'text-success', bg: 'bg-success/10' },
  warning: { text: 'text-warning', bg: 'bg-warning/10' },
};

export const StatsGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard 
          key={stat.label} 
          {...stat} 
          index={index}
          color={colorMap[stat.color as keyof typeof colorMap].text}
          bg={colorMap[stat.color as keyof typeof colorMap].bg}
        />
      ))}
    </div>
  );
};
