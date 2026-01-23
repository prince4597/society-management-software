'use client';

import { Search, Menu, User, Bell, Settings } from 'lucide-react';
import type { AdminUser } from '@/types';
import { ThemeToggle } from '@/components/ui';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface SuperAdminHeaderProps {
  user: AdminUser | null;
  onToggleSidebar: () => void;
}

export const SuperAdminHeader = ({ user, onToggleSidebar }: SuperAdminHeaderProps) => {
  return (
    <header className="h-16 bg-background/60 backdrop-blur-md border-b border-border/40 flex items-center justify-between px-6 z-40 sticky top-0">
      <div className="flex items-center gap-4 flex-1">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onToggleSidebar}
          className="p-2 hover:bg-secondary rounded-lg transition-all text-muted-foreground hover:text-foreground"
          aria-label="Toggle Navigation"
        >
          <Menu size={20} />
        </motion.button>

        <div className="max-w-[400px] w-full hidden md:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search..."
              className="block w-full bg-secondary/40 border border-transparent rounded-lg py-2 pl-10 pr-4 text-sm focus:bg-background focus:ring-2 focus:ring-primary/10 focus:border-border/60 transition-all text-foreground placeholder-muted-foreground/30"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 p-1 bg-secondary/30 rounded-xl border border-border/30 mr-2">
          <ThemeToggle />
          <button className="p-2 hover:bg-background rounded-lg text-muted-foreground hover:text-foreground transition-all relative group" aria-label="Notifications">
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary rounded-full ring-2 ring-background ring-offset-0" />
          </button>
          <Link href="/super-admin/profile" className="p-2 hover:bg-background rounded-lg text-muted-foreground hover:text-foreground transition-all" title="Settings">
            <Settings size={18} />
          </Link>
        </div>

        <Link href="/super-admin/profile" className="flex items-center gap-3 p-1 pl-3 hover:bg-secondary/40 rounded-xl transition-all border border-transparent hover:border-border/40 group">
          <div className="hidden lg:block text-right">
            <p className="text-xs font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[10px] text-muted-foreground font-medium opacity-60">
              Administrator
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary border border-primary/20 text-xs">
            {user?.firstName?.[0] || <User size={14} />}
          </div>
        </Link>
      </div>
    </header>
  );
};
