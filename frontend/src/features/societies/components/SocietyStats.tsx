import { Users, UserCheck, Calendar, Building2 } from 'lucide-react';
import { Card } from '@/components/ui';
import type { Society } from '@/types';

interface SocietyStatsProps {
  society: Society;
}

export const SocietyStats = ({ society }: SocietyStatsProps) => {
  const stats = [
    { icon: Users, label: "Total Asset Load", value: `${society.totalFlats || 0} Units` },
    { icon: UserCheck, label: "Active Administrators", value: `${society.admins?.length || 0} Nodes` },
    { icon: Calendar, label: "Onboard Date", value: society.createdAt ? new Date(society.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Unknown' },
    { icon: Building2, label: "Managed Code", value: society.code || 'N/A' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <Card key={i} padding="sm" className="bg-card/50 border-border/50 hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-secondary/50 flex items-center justify-center text-primary border border-border/30">
              <stat.icon size={18} />
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em] leading-none mb-1">{stat.label}</p>
              <p className="text-sm font-bold text-foreground truncate">{stat.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
