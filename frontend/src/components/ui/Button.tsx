'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-primary text-primary-foreground border-b-2 border-primary/20 hover:bg-primary/95',
      secondary: 'bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80',
      outline: 'bg-transparent border border-border text-foreground hover:bg-secondary hover:text-primary transition-colors',
      ghost: 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary',
      danger: 'bg-danger text-danger-foreground border-b-2 border-danger/20 hover:bg-danger/95',
    };

    const sizes = {
      sm: 'h-8 px-3 text-[11px] rounded',
      md: 'h-9 px-4 text-xs rounded-md',
      lg: 'h-11 px-6 text-sm rounded-lg',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20 disabled:opacity-50 disabled:cursor-not-allowed select-none active:translate-y-[1px]',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        <div className={cn("flex items-center justify-center gap-2", isLoading && "opacity-0")}>
          {leftIcon && <span className="w-3.5 h-3.5 shrink-0 opacity-80">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="w-3.5 h-3.5 shrink-0 opacity-80">{rightIcon}</span>}
        </div>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
