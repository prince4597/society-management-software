'use client';

import { Sidebar as BaseSidebar } from '@/components/layout/Sidebar';
import { LucideIcon } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  navItems: Array<{ icon: LucideIcon; label: string; href: string }>;
  onLogout: () => void;
}

export const Sidebar = (props: SidebarProps) => {
  return (
    <BaseSidebar
      {...props}
      quickAction={{
        label: 'Quick Action',
        href: '#',
      }}
    />
  );
};
