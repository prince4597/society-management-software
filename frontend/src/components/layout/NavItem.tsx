'use client';

import { LucideIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

export const NavItem = ({ icon: Icon, label, href }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all duration-200 group relative',
        isActive
          ? 'bg-sidebar-active text-sidebar-active-text font-bold'
          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
      )}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
      )}
      <Icon
        className={cn(
          'w-4 h-4 transition-colors duration-200 shrink-0',
          isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
        )}
        strokeWidth={isActive ? 2.5 : 2}
      />
      <span className="text-[13px] tracking-tight truncate">{label}</span>
    </Link>
  );
};
