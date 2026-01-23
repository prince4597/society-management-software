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
      primary: 'bg-primary text-primary-foreground shadow-[0_8px_16px_-6px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_12px_24px_-8px_rgba(var(--primary-rgb),0.5)] hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 active:scale-[0.97]',
      secondary: 'bg-secondary/70 backdrop-blur-md text-secondary-foreground border border-white/10 hover:bg-secondary hover:border-white/20 hover:shadow-md active:scale-[0.97]',
      outline: 'bg-white/5 backdrop-blur-sm border border-border/60 text-foreground hover:bg-white/10 hover:border-primary/40 hover:text-primary hover:shadow-lg hover:shadow-primary/5 active:scale-[0.97]',
      ghost: 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-white/5 active:scale-[0.97]',
      danger: 'bg-danger text-danger-foreground shadow-[0_8px_16px_-6px_rgba(var(--danger-rgb),0.3)] hover:shadow-[0_12px_24px_-8px_rgba(var(--danger-rgb),0.5)] hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 active:scale-[0.97]',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs rounded-sm',
      md: 'px-4 py-2 text-sm rounded-md',
      lg: 'px-6 py-3 text-base rounded-lg',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed relative overflow-hidden',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        <div className={cn("flex items-center justify-center gap-2", isLoading && "opacity-0")}>
          {leftIcon && <span className="w-4 h-4">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="w-4 h-4">{rightIcon}</span>}
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
