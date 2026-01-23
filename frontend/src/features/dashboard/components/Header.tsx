'use client';

import { Search, User, HelpCircle, Settings, Grid, ShieldCheck } from 'lucide-react';
import type { AdminUser } from '@/types';
import { ThemeToggle, Button } from '@/components/ui';
import { Header as BaseHeader } from '@/components/layout/Header';

interface HeaderProps {
  user: AdminUser | null;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Header = ({ user, onToggleSidebar }: HeaderProps) => {
  return (
    <BaseHeader
      onToggleSidebar={onToggleSidebar}
      leftContent={
        <div className="flex items-center gap-2.5 ml-2">
          <div className="w-7 h-7 rounded bg-primary flex items-center justify-center border border-primary/20 shadow-sm">
            <ShieldCheck size={14} className="text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="text-xs font-bold text-foreground hidden lg:block uppercase tracking-[0.2em]">Management Console</span>
        </div>
      }
      centerContent={
        <div className="max-w-[480px] w-full mx-4 hidden md:block">
          <div className="relative group">
            <div className="absolute left-0 inset-y-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" strokeWidth={2.5} />
            </div>
            <input
              type="text"
              placeholder="Search administration, residents, or reports..."
              className="block w-full bg-secondary/30 border border-border h-9 rounded-md py-2 pl-9 pr-4 text-[11px] font-medium focus:bg-background focus:ring-2 focus:ring-primary/5 focus:border-primary transition-all text-foreground placeholder-muted-foreground"
            />
          </div>
        </div>
      }
      rightContent={
        <div className="flex items-center gap-1">
          <div className="hidden sm:flex items-center gap-0.5">
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground">
              <HelpCircle size={16} />
            </Button>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground">
              <Settings size={16} />
            </Button>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground">
              <Grid size={16} />
            </Button>
          </div>

          <div className="ml-2 pl-2 border-l border-border h-6 flex items-center">
            <div className="w-8 h-8 rounded bg-secondary/50 flex items-center justify-center border border-border/50 font-bold text-xs text-muted-foreground shadow-sm">
              {user?.firstName?.[0] || 'A'}
            </div>
          </div>
        </div>
      }
    />
  );
};
