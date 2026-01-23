'use client';

import * as React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';
import { TableRow, TableCell } from './Table';
import { cn } from '@/lib/utils';

/**
 * Generic Empty State component for consistent visual feedback
 */
interface EmptyStateProps {
  message?: string;
  icon?: LucideIcon;
  height?: string;
  className?: string;
}

export const EmptyState = ({
  message = "No records identified",
  icon: Icon = Inbox,
  height = "h-64",
  className
}: EmptyStateProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center opacity-30 select-none", height, className)}>
      <Icon size={48} className="mb-4" strokeWidth={1.5} />
      <p className="font-black uppercase tracking-[0.2em] text-[10px]">{message}</p>
    </div>
  );
};

interface TableLoadingProps {
  columns: number;
  rows?: number;
}

export const TableLoading = ({ columns, rows = 5 }: TableLoadingProps) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i} className="animate-pulse border-none">
          <TableCell colSpan={columns}>
            <div className="h-12 bg-muted/30 rounded-xl my-1 w-full" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

interface TableEmptyProps extends EmptyStateProps {
  columns: number;
}

export const TableEmpty = ({ columns, ...props }: TableEmptyProps) => {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={columns}>
        <EmptyState {...props} />
      </TableCell>
    </TableRow>
  );
};
