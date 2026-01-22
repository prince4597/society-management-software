'use client';

import { LogOut, LucideIcon, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavItem } from './NavItem';
import { Button } from '@/components/ui';

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
          className="bg-card flex flex-col z-30 h-full border-r border-border transition-colors duration-200 shrink-0 overflow-hidden"
        >
          <div className="p-4">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-3 h-12 rounded-lg border-dashed border-2 hover:border-primary hover:bg-primary/5 group"
            >
              <Plus className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-xs uppercase tracking-wider">Quick Action</span>
            </Button>
          </div>

          <nav className="flex-1 mt-2 px-3 space-y-1">
            {navItems.map((item) => (
              <NavItem key={item.label} {...item} />
            ))}
          </nav>

          <div className="p-4 mt-auto border-t border-border">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all font-medium group"
            >
              <LogOut className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              <span className="text-sm">Sign out</span>
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
