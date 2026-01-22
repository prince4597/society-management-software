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
        "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group",
        isActive
          ? "bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      <Icon className={cn(
        "w-5 h-5 transition-transform duration-200",
        isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100 group-hover:scale-110"
      )} strokeWidth={isActive ? 2.5 : 1.5} />
      <span className="text-sm tracking-tight font-medium">{label}</span>
    </Link>
  );
};
