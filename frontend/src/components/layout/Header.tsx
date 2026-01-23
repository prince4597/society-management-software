'use client';

import { Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HeaderProps {
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  centerContent?: React.ReactNode;
  onToggleSidebar?: () => void;
  className?: string;
  showMenuButton?: boolean;
}

export const Header = ({ 
  leftContent, 
  rightContent, 
  centerContent,
  onToggleSidebar,
  className,
  showMenuButton = true
}: HeaderProps) => {
  return (
    <header className={cn(
      "h-16 bg-header-bg border-b border-border flex items-center justify-between px-6 z-40 sticky top-0",
      className
    )}>
      <div className="flex items-center gap-4 flex-1">
        {showMenuButton && onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-secondary rounded-lg transition-all text-muted-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            aria-label="Toggle Navigation"
          >
            <Menu size={20} />
          </button>
        )}
        <div className="flex items-center gap-2">
          {leftContent}
        </div>
      </div>

      {centerContent && (
        <div className="hidden lg:flex flex-1 justify-center px-4">
          {centerContent}
        </div>
      )}

      <div className="flex items-center gap-3">
        {rightContent}
      </div>
    </header>
  );
};
