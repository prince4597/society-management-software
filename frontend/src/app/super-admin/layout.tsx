'use client';

import { SuperAdminSidebar, SuperAdminHeader } from '@/features/super-admin';
import { ProtectedRoute } from '@/features/auth';
import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <ProtectedRoute allowedRole="SUPER_ADMIN">
      <div className="min-h-screen bg-background text-foreground flex overflow-hidden transition-colors duration-500">
        <SuperAdminSidebar 
          isOpen={isSidebarOpen} 
          onLogout={logout} 
        />
        
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <SuperAdminHeader 
            user={user} 
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          />
          
          <main className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar bg-secondary/10">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
