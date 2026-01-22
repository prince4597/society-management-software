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
      primary: 'gradient-bg text-white shadow-lg shadow-blue-500/20 hover:opacity-90',
      secondary: 'bg-white/10 text-white hover:bg-white/20 border border-white/10',
      outline: 'bg-transparent border border-white/10 text-white hover:bg-white/5',
      ghost: 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5',
      danger: 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20',
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs rounded-lg',
      md: 'px-6 py-3.5 text-sm rounded-2xl',
      lg: 'px-8 py-4 text-base rounded-2xl',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed relative overflow-hidden',
          variants[variant],
          sizes[size],
          isLoading && 'shimmer-mask cursor-wait',
          className
        )}
        {...props}
      >
        <div className={cn("flex items-center justify-center gap-2", isLoading && "opacity-0")}>
          {leftIcon && <span>{leftIcon}</span>}
          {children}
          {rightIcon && <span>{rightIcon}</span>}
        </div>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-white" />
          </div>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
