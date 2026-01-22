'use client';

import { Search, Menu, User, HelpCircle, Settings, Grid } from 'lucide-react';
import type { AdminUser } from '@/types';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  user: AdminUser | null;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Header = ({ user, onToggleSidebar }: HeaderProps) => {
  return (
    <header className="h-16 bg-[var(--header-bg)] border-b border-[var(--border)] flex items-center justify-between px-4 z-40 transition-colors duration-200">
      <div className="flex items-center gap-2 flex-1">
        <button
          onClick={onToggleSidebar}
          className="p-2.5 hover:bg-[var(--secondary)] rounded-full transition-colors text-[var(--muted-foreground)] dark:text-[var(--foreground)]"
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={24} strokeWidth={1.5} />
        </button>

        <div className="flex items-center gap-2 ml-2">
          <img src="/logo.svg" alt="HPH" className="w-8 h-8 hidden sm:block" onError={(e) => e.currentTarget.style.display = 'none'} />
          <span className="text-xl font-normal text-[var(--muted-foreground)] dark:text-[var(--foreground)] hidden lg:block tracking-tight">HPH Society</span>
        </div>

        <div className="max-w-[720px] w-full mx-4 hidden md:block">
          <div className="relative group">
            <div className="absolute left-0 inset-y-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-[var(--muted-foreground)]" strokeWidth={1.5} />
            </div>
            <input
              type="text"
              placeholder="Search administration, residents, or reports"
              className="block w-full bg-[var(--input-bg)] border-transparent rounded-lg py-2.5 pl-11 pr-4 text-base focus:bg-[var(--background)] focus:border-transparent focus:ring-1 focus:ring-[var(--border)] transition-all text-[var(--foreground)] placeholder-[var(--muted-foreground)] workspace-shadow-hover"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <div className="hidden sm:flex items-center gap-1">
          <ThemeToggle />
          <button className="p-2.5 hover:bg-[var(--secondary)] rounded-full transition-colors text-[var(--muted-foreground)] dark:text-[var(--foreground)]" aria-label="Help Center">
            <HelpCircle size={22} strokeWidth={1.5} />
          </button>
          <button className="p-2.5 hover:bg-[var(--secondary)] rounded-full transition-colors text-[var(--muted-foreground)] dark:text-[var(--foreground)]" aria-label="Settings">
            <Settings size={22} strokeWidth={1.5} />
          </button>
          <button className="p-2.5 hover:bg-[var(--secondary)] rounded-full transition-colors text-[var(--muted-foreground)] dark:text-[var(--foreground)]" aria-label="Apps">
            <Grid size={22} strokeWidth={1.5} />
          </button>
        </div>

        <div className="ml-2 pl-2 border-l border-[var(--border)] flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[var(--primary)] flex items-center justify-center font-medium text-[var(--primary-foreground)] shadow-sm select-none">
            {user?.firstName?.[0] || <User size={20} />}
          </div>
        </div>
      </div>
    </header>
  );
};
