'use client';

import { useState } from 'react';
import { Home, Users, Search, Shield, CreditCard, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { Sidebar, Header } from '@/features/dashboard';
import { AnimatePresence } from 'framer-motion';
import { ProtectedRoute } from '@/features/auth';

const navItems = [
  { icon: LayoutDashboard, label: 'Control Center', href: '/dashboard' },
  { icon: Home, label: 'Units & Assets', href: '/dashboard/properties' },
  { icon: Users, label: 'Resident Directory', href: '/dashboard/residents' },
  { icon: Shield, label: 'Safety & Staff', href: '/dashboard/staff' },
  { icon: CreditCard, label: 'Dues & Treasury', href: '/dashboard/finance' },
  { icon: Search, label: 'Visitor Logs', href: '/dashboard/visitors' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <ProtectedRoute allowedRole="SOCIETY_ADMIN">
      <div className="min-h-screen bg-background text-foreground flex overflow-hidden transition-colors duration-500">
        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <Sidebar
              isOpen={isSidebarOpen}
              navItems={navItems}
              onLogout={logout}
            />
          )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col relative overflow-hidden">
          <Header
            user={user}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar bg-secondary/20">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
