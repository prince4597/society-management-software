'use client';

import { Search, Menu, User, Grid, Bell } from 'lucide-react';
import type { AdminUser } from '@/types';
import { ThemeToggle } from '@/components/ui';
import { motion } from 'framer-motion';

interface SuperAdminHeaderProps {
  user: AdminUser | null;
  onToggleSidebar: () => void;
}

export const SuperAdminHeader = ({ user, onToggleSidebar }: SuperAdminHeaderProps) => {
  return (
    <header className="h-16 bg-background/60 backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-6 z-40 transition-all duration-500 sticky top-0">
      <div className="flex items-center gap-4 flex-1">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onToggleSidebar}
          className="p-2.5 hover:bg-secondary/80 rounded-xl transition-all text-muted-foreground hover:text-foreground border border-transparent hover:border-border shadow-sm group"
          aria-label="Toggle Navigation"
        >
          <Menu size={20} className="group-hover:rotate-180 transition-transform duration-500" />
        </motion.button>

        <div className="max-w-[480px] w-full hidden md:block">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 group-focus-within:text-primary transition-colors" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search infra, societies, logs..."
              className="block w-full bg-secondary/30 border border-transparent rounded-xl py-2 pl-10 pr-4 text-xs focus:bg-background focus:ring-1 focus:ring-primary focus:border-primary transition-all text-foreground placeholder-muted-foreground/60 border-border/30 hover:border-border/60"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 p-1 bg-secondary/30 rounded-2xl border border-border/20 shadow-inner">
          <ThemeToggle />
          <button className="p-2 hover:bg-background rounded-xl text-muted-foreground hover:text-foreground transition-all relative" aria-label="Notifications">
            <Bell size={18} strokeWidth={1.5} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full ring-2 ring-background ring-offset-1" />
          </button>
          <button className="p-2 hover:bg-background rounded-xl text-muted-foreground hover:text-foreground transition-all" aria-label="Utilities">
            <Grid size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div className="ml-3 pl-3 border-l border-border/50 flex items-center gap-3">
          <div className="hidden lg:block text-right">
             <p className="text-xs font-bold text-foreground leading-none">{user?.firstName}</p>
             <p className="text-[10px] text-muted-foreground uppercase tracking-tight mt-1 font-semibold italic">System Super Admin</p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center font-bold text-primary-foreground shadow-lg shadow-primary/20 select-none cursor-pointer"
          >
            {user?.firstName?.[0] || <User size={20} />}
          </motion.div>
        </div>
      </div>
    </header>
  );
};
