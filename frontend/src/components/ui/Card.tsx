'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'flat' | 'elevated' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = ({ 
  className, 
  variant = 'flat', 
  padding = 'md', 
  children, 
  ...props 
}: CardProps) => {
  const variants = {
    flat: 'bg-card border border-border shadow-sm',
    elevated: 'bg-card border border-border/50 shadow-md',
    outline: 'bg-transparent border border-border shadow-none',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(
        'rounded-lg overflow-hidden',
        variants[variant],
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className, title, subtitle, action, ...props }: any) => (
  <div className={cn('flex items-center justify-between mb-4 border-b border-border/20 pb-4', className)} {...props}>
    <div>
      <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">{title}</h3>
      {subtitle && <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const CardContent = ({ className, ...props }: any) => (
  <div className={cn('', className)} {...props} />
);

export const CardFooter = ({ className, ...props }: any) => (
  <div className={cn('mt-6 pt-4 border-t border-border/40', className)} {...props} />
);
