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
        "flex items-center gap-4 px-6 py-3 rounded-r-full transition-all duration-150 group",
        isActive
          ? "bg-[var(--sidebar-active)] text-[var(--sidebar-active-text)] font-medium"
          : "text-[var(--sidebar-foreground)] hover:bg-[var(--secondary)]"
      )}
    >
      <Icon className={cn(
        "w-5 h-5 opacity-70",
        isActive && "opacity-100"
      )} strokeWidth={isActive ? 2 : 1.5} />
      <span className="text-sm tracking-normal">{label}</span>
    </Link>
  );
};
