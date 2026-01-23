'use client';

import { SocietyManagement } from '@/features/societies';

export default function SocietiesPage() {
  return (
    <div className="space-y-10 pb-10">
      <section aria-label="Society Management">
        <SocietyManagement />
      </section>
    </div>
  );
}
