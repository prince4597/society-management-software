'use client';

import { SocietyDetail } from '@/features/super-admin';
import { use } from 'react';

export default function SocietyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="pb-10">
      <SocietyDetail id={id} />
    </div>
  );
}
