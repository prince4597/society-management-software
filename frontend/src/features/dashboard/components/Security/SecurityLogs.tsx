'use client';

import { ShieldCheck, MoreVertical, Filter, Download } from 'lucide-react';
import { LogItem } from './LogItem';

const logs = [
  { name: 'John Peterson', action: 'Guest Entry', target: 'Villa 104', time: '10:45 AM', status: 'Approved' },
  { name: 'Delivery Partner', action: 'Vendor Access', target: 'Main Gate', time: '10:30 AM', status: 'Approved' },
  { name: 'Sarah Miller', action: 'Service Request', target: 'Apt B-902', time: '09:12 AM', status: 'Pending' },
  { name: 'Security Check', action: 'Patrol Report', target: 'Zone C', time: '08:00 AM', status: 'Completed' },
];

export const SecurityLogs = () => {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg workspace-shadow overflow-hidden">
      <div className="p-6 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--sidebar-active)] rounded-lg">
            <ShieldCheck className="text-[var(--primary)]" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-normal text-[var(--foreground)] tracking-tight">Security Access Logs</h2>
            <p className="text-xs text-[var(--muted-foreground)] font-medium mt-0.5 uppercase tracking-wider">Infrastructure Monitoring</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-[var(--secondary)] rounded-full text-[var(--muted-foreground)] dark:text-[var(--foreground)] transition-colors" title="Filter">
            <Filter size={18} strokeWidth={1.5} />
          </button>
          <button className="p-2 hover:bg-[var(--secondary)] rounded-full text-[var(--muted-foreground)] dark:text-[var(--foreground)] transition-colors" title="Download">
            <Download size={18} strokeWidth={1.5} />
          </button>
          <button className="p-2 hover:bg-[var(--secondary)] rounded-full text-[var(--muted-foreground)] dark:text-[var(--foreground)] transition-colors">
            <MoreVertical size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="divide-y divide-[var(--border)]">
        {logs.map((log, i) => (
          <LogItem key={i} {...log} index={i} />
        ))}
      </div>

      <div className="p-4 bg-[var(--muted)] border-t border-[var(--border)] text-center">
        <button className="text-sm font-medium text-[var(--primary)] hover:underline">View comprehensive audit trace</button>
      </div>
    </div>
  );
};
