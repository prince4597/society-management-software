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
    <div className="min-h-screen flex items-center justify-center p-4 bg-background transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px]"
      >
        <div className="bg-card rounded-lg p-8 sm:p-10 border border-border relative overflow-hidden workspace-shadow">
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-background/60 backdrop-blur-[2px] flex items-center justify-center"
              >
                <div className="premium-spinner" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              Welcome Back
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Sign in to manage your society portal
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-destructive/10 text-destructive p-3 rounded-md flex items-center gap-3 text-sm border border-destructive/20"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <Input
                {...register('email')}
                label="Email Address"
                type="email"
                placeholder="admin@example.com"
                error={errors.email?.message}
                autoComplete="email"
                disabled={isLoading}
              />

              <div className="space-y-1">
                <Input
                  {...register('password')}
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-xs font-medium text-primary hover:underline transition-all"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full h-11"
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </div>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">New here?</span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              className="w-full h-11"
              disabled={isLoading}
            >
              Request Access
            </Button>
          </form>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 text-xs text-muted-foreground">
          <div className="flex gap-6">
            <button className="hover:text-foreground transition-colors">Help</button>
            <button className="hover:text-foreground transition-colors">Privacy</button>
            <button className="hover:text-foreground transition-colors">Terms</button>
          </div>
          <p>© 2026 Society Management System. All rights reserved.</p>
        </div>
      </motion.div>
    </div>
  );
};
