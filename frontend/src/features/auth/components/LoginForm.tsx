'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthFlow } from '../hooks/useAuthFlow';
import { Input, Button } from '@/components/ui';

const loginSchema = z.object({
  email: z.string().email('Enter a valid administrative email'),
  password: z.string().min(6, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const { error, isLoading, handleLogin } = useAuthFlow();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched'
  });

  const onSubmit = async (data: LoginFormValues) => {
    await handleLogin(data);
  };

  return (
    <div className="relative w-full max-w-[440px] perspective-1000">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative group"
      >
        {/* Advanced Glassmorphic Container */}
        <div className="relative overflow-hidden bg-background/30 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 sm:p-12 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.3)]">
          {/* Subtle Inner Glow */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-background/40 backdrop-blur-sm flex items-center justify-center"
              >
                <div className="premium-spinner" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col items-center mb-10 text-center relative z-10">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 ring-1 ring-primary/20"
            >
              <ShieldCheck className="w-8 h-8 text-primary" />
            </motion.div>
            <h1 className="text-3xl font-black text-foreground tracking-tight mb-3">
              Admin Access
            </h1>
            <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-[240px]">
              Authenticate to access the society management control plane
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10" autoComplete="off" noValidate>
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-destructive/10 text-destructive p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold border border-destructive/20"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-5">
              <div className="space-y-2">
                <Input
                  {...register('email')}
                  label="Administrative Email"
                  type="email"
                  placeholder="admin@society.com"
                  error={errors.email?.message}
                  autoComplete="one-time-code"
                  data-1p-ignore
                  data-lpignore="true"
                  disabled={isLoading}
                  className="bg-background/50 border-white/5 h-12 rounded-2xl focus:bg-background/80 transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <Input
                  {...register('password')}
                  label="Security Password"
                  type="password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  autoComplete="one-time-code"
                  data-1p-ignore
                  data-lpignore="true"
                  disabled={isLoading}
                  className="bg-background/50 border-white/5 h-12 rounded-2xl focus:bg-background/80 transition-all font-medium"
                />
                <div className="flex justify-end pr-1">
                  <button
                    type="button"
                    className="text-[11px] font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest"
                  >
                    Forgot Key?
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full h-12 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-[0.98] transition-all"
                isLoading={isLoading}
              >
                Authorize
              </Button>
            </div>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/5"></span>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.2em]">
                <span className="bg-transparent px-3 text-muted-foreground/60 backdrop-blur-xl">Institutional Login</span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              className="w-full h-12 rounded-2xl text-xs font-bold border-white/10 hover:bg-white/5 transition-all"
              disabled={isLoading}
            >
              Request Ecosystem Access
            </Button>
          </form>
        </div>

        {/* Bottom Metadata */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex flex-col items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40"
        >
          <div className="flex gap-8">
            <button className="hover:text-primary transition-colors">Support</button>
            <button className="hover:text-primary transition-colors">Privacy</button>
            <button className="hover:text-primary transition-colors">Governance</button>
          </div>
          <p className="opacity-60 whitespace-nowrap">© 2026 ARCHITECTURAL CONTROL PLANE. SECURED BY HPH.</p>
        </motion.div>
      </motion.div>
    </div>
  );
};
