'use client';

import { LogOut, LucideIcon, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavItem } from './NavItem';

interface SidebarProps {
  isOpen: boolean;
  navItems: Array<{ icon: LucideIcon; label: string; href: string }>;
  onLogout: () => void;
}

export const Sidebar = ({ isOpen, navItems, onLogout }: SidebarProps) => {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 256, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="bg-[var(--sidebar-bg)] flex flex-col z-30 h-full border-r border-[var(--border)] transition-colors duration-200 shrink-0 overflow-hidden"
        >
          <div className="p-4 pt-4">
            <button className="flex items-center gap-3 px-6 py-4 bg-[var(--card)] workspace-shadow rounded-3xl hover:workspace-shadow-hover transition-all text-[var(--foreground)] font-medium text-sm group">
              <Plus className="w-6 h-6 text-[var(--primary)]" />
              <span className="opacity-100 transition-opacity">Request Audit</span>
            </button>
          </div>

          <nav className="flex-1 mt-4 space-y-0.5">
            {navItems.map((item) => (
              <NavItem key={item.label} {...item} />
            ))}
          </nav>

          <div className="p-4 mt-auto border-t border-[var(--border)]">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-4 px-6 py-3 rounded-r-full text-[var(--muted-foreground)] hover:bg-[var(--secondary)] transition-all font-medium group"
            >
              <LogOut className="w-5 h-5 opacity-70 group-hover:opacity-100" />
              <span className="text-sm">Sign out</span>
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
