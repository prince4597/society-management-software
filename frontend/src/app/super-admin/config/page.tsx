'use client';

import { QuickConfig } from '@/features/system';

export default function ConfigPage() {
  return (
    <div className="space-y-10 pb-10">
      <section aria-label="Quick Actions">
        <QuickConfig />
      </section>
    </div>
  );
}
