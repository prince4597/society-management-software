'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = 'info', duration = 5000) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type, duration }]);

      if (duration !== Infinity) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast]
  );

  const success = (msg: string, dur?: number) => toast(msg, 'success', dur);
  const error = (msg: string, dur?: number) => toast(msg, 'error', dur);
  const info = (msg: string, dur?: number) => toast(msg, 'info', dur);
  const warning = (msg: string, dur?: number) => toast(msg, 'warning', dur);

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none w-full max-w-sm">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className={cn(
                'pointer-events-auto flex items-center gap-4 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all group',
                t.type === 'success' && 'bg-success/10 border-success/20 text-success',
                t.type === 'error' && 'bg-danger/10 border-danger/20 text-danger',
                t.type === 'warning' && 'bg-warning/10 border-warning/20 text-warning',
                t.type === 'info' && 'bg-info/10 border-info/20 text-info'
              )}
            >
              <div className="shrink-0 group-hover:scale-110 transition-transform">
                {t.type === 'success' && <CheckCircle2 size={20} />}
                {t.type === 'error' && <AlertCircle size={20} />}
                {t.type === 'warning' && <AlertTriangle size={20} />}
                {t.type === 'info' && <Info size={20} />}
              </div>
              <p className="text-sm font-bold tracking-tight flex-1">{t.message}</p>
              <button
                onClick={() => removeToast(t.id)}
                className="opacity-40 hover:opacity-100 p-1 rounded-lg hover:bg-black/5 transition-all"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
