'use client';

import { ShieldCheck } from 'lucide-react';
import { Sidebar as BaseSidebar } from '@/components/layout/Sidebar';
import { 
  LayoutDashboard, 
  Building2, 
  Activity, 
  Settings 
} from 'lucide-react';

interface SuperAdminSidebarProps {
  isOpen: boolean;
  onLogout: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Control Center', href: '/super-admin' },
  { icon: Building2, label: 'Societies', href: '/super-admin/societies' },
  { icon: Activity, label: 'System Health', href: '/super-admin/health' },
  { icon: Settings, label: 'Global Config', href: '/super-admin/config' },
];

export const SuperAdminSidebar = (props: SuperAdminSidebarProps) => {
  return (
    <BaseSidebar
      {...props}
      navItems={navItems}
      title="Global Admin"
      subtitle="Infrastructure"
      logoItem={<ShieldCheck className="text-primary-foreground w-5 h-5" />}
      quickAction={{
        label: "New Society",
        href: "/super-admin/societies"
      }}
      logoutConfig={{
        title: "Terminate Session?",
        description: "You are about to logout from the Super Admin Infrastructure. Any unsaved permission changes may be lost."
      }}
    />
  );
};
