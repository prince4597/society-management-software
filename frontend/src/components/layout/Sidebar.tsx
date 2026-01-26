'use client';

import { LogOut, LucideIcon, Plus } from 'lucide-react';
import { NavItem } from './NavItem';
import { Button, ConfirmDialog } from '@/components/ui';
import { useState } from 'react';
import Link from 'next/link';

interface SidebarProps {
  isOpen: boolean;
  onLogout: () => void;
  navItems: Array<{ icon: LucideIcon; label: string; href: string }>;
  title?: string;
  subtitle?: string;
  logoItem?: React.ReactNode;
  quickAction?: {
    label: string;
    href: string;
    icon?: LucideIcon;
  };
  logoutConfig?: {
    title: string;
    description: string;
  };
}

export const Sidebar = ({
  onLogout,
  navItems,
  title,
  subtitle,
  logoItem,
  quickAction,
  logoutConfig,
}: SidebarProps) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <aside className="bg-sidebar-bg flex flex-col z-30 h-full border-r border-border shrink-0 overflow-hidden relative">
      {/* Header / Brand */}
      {(title || logoItem) && (
        <div className="p-5 border-b border-border flex items-center gap-3 bg-card/5">
          {logoItem && (
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center shadow-sm">
              {logoItem}
            </div>
          )}
          {(title || subtitle) && (
            <div>
              {title && (
                <h2 className="font-bold text-xs tracking-tight text-foreground uppercase">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold leading-none mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Quick Action Area */}
      {quickAction && (
        <div className="px-4 py-4">
          <Link href={quickAction.href} className="block w-full">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 h-9 rounded border-dashed bg-secondary/10 hover:bg-primary/5 hover:border-primary/50"
            >
              {quickAction.icon ? (
                <quickAction.icon className="w-3.5 h-3.5 text-primary" />
              ) : (
                <Plus className="w-3.5 h-3.5 text-primary" />
              )}
              <span className="text-[10px] uppercase font-bold tracking-wider">
                {quickAction.label}
              </span>
            </Button>
          </Link>
        </div>
      )}

      <div className="px-4 mb-2">
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3 ml-2">
          Navigation
        </p>
        <nav className="flex-1 space-y-0.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </nav>
      </div>

      {/* Bottom Sector / Logout */}
      <div className="p-4 mt-auto border-t border-border bg-secondary/5">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-muted-foreground hover:bg-danger/10 hover:text-danger transition-all font-bold text-[11px] uppercase tracking-wider group"
        >
          <LogOut className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
          <span>Sign out</span>
        </button>
      </div>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={onLogout}
        variant="danger"
        title={logoutConfig?.title || 'End Session?'}
        description={
          logoutConfig?.description || 'Confirming will end your current administrative session.'
        }
        confirmLabel="Logout"
        cancelLabel="Stay Active"
      />
    </aside>
  );
};
