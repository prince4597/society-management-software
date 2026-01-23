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
      <div className="flex flex-col items-center text-center space-y-4 py-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center border shadow-lg",
            variant === 'danger'
              ? "bg-danger/10 border-danger/20 text-danger shadow-danger/10"
              : "bg-primary/10 border-primary/20 text-primary shadow-primary/10"
          )}
        >
          <AlertTriangle size={32} />
        </motion.div>

        <div className="space-y-1.5 px-2">
          <h4 className="text-xl font-black text-foreground tracking-tight">{title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed italic">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full pt-6">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl font-bold h-11 border border-transparent hover:bg-white/5 active:scale-95 transition-all text-muted-foreground"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
            className={cn(
              "rounded-xl font-black h-11 shadow-lg active:scale-95 transition-all",
              variant === 'danger' ? "shadow-danger/20" : "shadow-primary/20"
            )}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
