'use client';

import { LogOut, Plus, LayoutDashboard, Building2, Activity, Settings, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavItem } from './NavItem';
import { Button } from '@/components/ui';

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

export const SuperAdminSidebar = ({ isOpen, onLogout }: SuperAdminSidebarProps) => {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="bg-card flex flex-col z-30 h-full border-r border-border transition-colors duration-500 shrink-0 overflow-hidden relative"
        >
          {/* Sidebar Header/Logo */}
          <div className="p-6 border-b border-border/50 flex items-center gap-3">
             <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <ShieldCheck className="text-primary-foreground w-5 h-5" />
             </div>
             <div>
                <h2 className="font-bold text-sm tracking-tight text-foreground leading-none">Global Admin</h2>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-bold">Infrastructure</p>
             </div>
          </div>

          <div className="p-4">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 h-11 rounded-xl border-dashed border-2 hover:border-primary hover:bg-primary/5 group transition-all"
            >
              <Plus className="w-5 h-5 text-primary group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-bold text-[11px] uppercase tracking-wider">New Society</span>
            </Button>
          </div>

          <nav className="flex-1 mt-2 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => (
              <NavItem key={item.label} {...item} />
            ))}
          </nav>

          {/* User Section / Bottom */}
          <div className="p-4 mt-auto border-t border-border/50 bg-secondary/10">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all font-semibold group"
            >
              <LogOut className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              <span className="text-sm">Leave Workspace</span>
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
