'use client';

import { Search, Menu, User, HelpCircle, Settings, Grid, ShieldCheck } from 'lucide-react';
import type { AdminUser } from '@/types';
import { ThemeToggle } from '@/components/ui';

interface HeaderProps {
  user: AdminUser | null;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Header = ({ user, onToggleSidebar }: HeaderProps) => {
  return (
    <header className="h-16 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 z-40 transition-colors duration-200">
      <div className="flex items-center gap-2 flex-1">
        <button
          onClick={onToggleSidebar}
          className="p-2.5 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={24} strokeWidth={1.5} />
        </button>

        <div className="flex items-center gap-2 ml-2">
          {/* Logo Placeholder */}
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <ShieldCheck size={18} className="text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground hidden lg:block tracking-tight">HPH Society</span>
        </div>

        <div className="max-w-[600px] w-full mx-4 hidden md:block">
          <div className="relative group">
            <div className="absolute left-0 inset-y-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <input
              type="text"
              placeholder="Search administration, residents, or reports"
              className="block w-full bg-secondary/50 border border-transparent rounded-lg py-2 pl-11 pr-4 text-sm focus:bg-background focus:ring-1 focus:ring-primary focus:border-primary transition-all text-foreground placeholder-muted-foreground"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <div className="hidden sm:flex items-center gap-1">
          <ThemeToggle />
          <button className="p-2.5 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground" aria-label="Help Center">
            <HelpCircle size={20} strokeWidth={1.5} />
          </button>
          <button className="p-2.5 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground" aria-label="Settings">
            <Settings size={20} strokeWidth={1.5} />
          </button>
          <button className="p-2.5 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground" aria-label="Apps">
            <Grid size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div className="ml-2 pl-2 border-l border-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center font-medium text-primary-foreground shadow-sm select-none">
            {user?.firstName?.[0] || <User size={20} />}
          </div>
        </div>
      </div>
    </header>
  );
};
