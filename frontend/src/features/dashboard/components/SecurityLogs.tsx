import { ShieldCheck, Filter, Download, MoreHorizontal } from 'lucide-react';
import { LogItem } from './LogItem';
import { Card, Button } from '@/components/ui';

const logs = [
  { name: 'John Peterson', action: 'Guest Entry', target: 'Villa 104', time: '10:45 AM', status: 'Approved' },
  { name: 'Delivery Partner', action: 'Vendor Access', target: 'Main Gate', time: '10:30 AM', status: 'Approved' },
  { name: 'Sarah Miller', action: 'Service Request', target: 'Apt B-902', time: '09:12 AM', status: 'Pending' },
  { name: 'Security Check', action: 'Patrol Report', target: 'Zone C', time: '08:00 AM', status: 'Completed' },
];

export const SecurityLogs = () => {
  return (
    <Card className="overflow-hidden bg-card/30 border-border/40">
      <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between bg-secondary/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center border border-primary/20">
            <ShieldCheck className="text-primary" size={16} />
          </div>
          <div>
            <h2 className="text-xs font-bold text-foreground uppercase tracking-[0.1em]">Access Audit Trail</h2>
            <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">Real-time infrastructure monitoring</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
            <Filter size={14} />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
            <Download size={14} />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
            <MoreHorizontal size={14} />
          </Button>
        </div>
      </div>

      <div className="divide-y divide-border/50 bg-card/30">
        {logs.map((log, i) => (
          <LogItem key={i} {...log} index={i} />
        ))}
      </div>

      <div className="p-3 bg-secondary/5 border-t border-border/50">
        <Button variant="ghost" className="w-full text-[10px] uppercase font-bold tracking-widest h-8 text-primary hover:bg-primary/5">
          View full audit trail
        </Button>
      </div>
    </Card>
  );
};
