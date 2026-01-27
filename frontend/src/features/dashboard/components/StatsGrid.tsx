import { Users, Building2, Wallet, Shield, Loader2 } from 'lucide-react';
import { StatCard } from './StatCard';
import { useDashboardStats } from '../hooks/useDashboardStats';

export const StatsGrid = () => {
  const { stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-card/40 animate-pulse rounded-2xl flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-primary/20 animate-spin" />
          </div>
        ))}
      </div>
    );
  }

  const items = [
    {
      label: 'Total Residents',
      value: stats?.totalResidents.toLocaleString() || '0',
      growth: 'Live',
      icon: Users,
      color: 'info',
    },
    {
      label: 'Mapped Units',
      value: stats?.totalProperties.toLocaleString() || '0',
      growth: `${Math.round(((stats?.totalProperties || 0) / (stats?.totalFlats || 1)) * 100)}%`,
      icon: Building2,
      color: 'primary',
    },
    {
      label: 'Planned Capacity',
      value: stats?.totalFlats.toLocaleString() || '0',
      growth: 'Fixed',
      icon: Wallet,
      color: 'success',
    },
    {
      label: 'Instance Status',
      value: '100%',
      growth: 'Secure',
      icon: Shield,
      color: 'warning',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((stat, index) => (
        <StatCard key={stat.label} {...stat} index={index} />
      ))}
    </div>
  );
};
