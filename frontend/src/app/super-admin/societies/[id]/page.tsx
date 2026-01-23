'use client';

import { SocietyDetailContainer } from '@/features/societies';
import { use } from 'react';

export default function SocietyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="pb-10">
      <SocietyDetailContainer id={id} />
    </div>
  );
}
