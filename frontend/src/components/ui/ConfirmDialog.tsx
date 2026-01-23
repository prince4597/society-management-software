'use client';

import { Dialog } from './Dialog';
import { Button } from './Button';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  variant?: 'primary' | 'danger';
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  isLoading = false,
  variant = 'primary'
}: ConfirmDialogProps) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} showClose={!isLoading} className="max-w-md">
      <div className="flex flex-col items-center text-center space-y-5 py-4 px-2">
        <div
          className={cn(
            "w-14 h-14 rounded-lg flex items-center justify-center border",
            variant === 'danger'
              ? "bg-danger/10 border-danger/20 text-danger"
              : "bg-primary/10 border-primary/20 text-primary"
          )}
        >
          <AlertTriangle size={28} />
        </div>

        <div className="space-y-2">
          <h4 className="text-lg font-bold text-foreground tracking-tight">{title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex flex-col-reverse sm:grid sm:grid-cols-2 gap-3 w-full pt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
            className="w-full"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
