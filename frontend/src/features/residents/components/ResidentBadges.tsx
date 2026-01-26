'use client';

import { Badge } from '@/components/ui';
import { User, ShieldCheck } from 'lucide-react';

export const OwnerBadge = ({ className }: { className?: string }) => (
  <Badge variant="success" className={className}>
    <ShieldCheck size={10} className="mr-1" />
    Owner
  </Badge>
);

export const TenantBadge = ({ className }: { className?: string }) => (
  <Badge variant="info" className={className}>
    <User size={10} className="mr-1" />
    Tenant
  </Badge>
);

export const FamilyBadge = ({ className }: { className?: string }) => (
  <Badge variant="neutral" className={className}>
    Family
  </Badge>
);
