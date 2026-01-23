'use client';

import { SystemHealthCard, GlobalMetrics, AuditTrail } from '@/features/system';

export default function HealthPage() {
  return (
    <div className="space-y-10 pb-10">
      <section aria-label="System Infrastructure">
        <SystemHealthCard />
      </section>
      
      <section aria-label="Global Metrics">
        <GlobalMetrics />
      </section>

      <section aria-label="System Activity">
        <AuditTrail />
      </section>
    </div>
  );
}
