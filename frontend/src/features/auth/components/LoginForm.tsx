'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthFlow } from '../hooks/useAuthFlow';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8f9fa] dark:bg-[#121212] transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[448px]"
      >
        <div className="bg-white dark:bg-[#202124] rounded-lg p-8 sm:p-12 border border-[#dadce0] dark:border-[#3c4043] relative overflow-hidden workspace-shadow">
          {isLoading && <div className="loading-progress" />}

          <div className="flex flex-col items-center mb-8">
            <ShieldCheck className="w-10 h-10 text-[#1a73e8] mb-4" />
            <h1 className="text-2xl font-normal text-[#202124] dark:text-[#e8eaed] tracking-tight">
              Sign in
            </h1>
            <p className="text-[#3c4043] dark:text-[#9aa0a6] mt-2 text-center text-base">
              Use your HPH Management Account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-[#fce8e6] dark:bg-[#3c2a29] text-[#d93025] dark:text-[#f28b82] p-3 rounded flex items-center gap-3 text-sm border border-[#f5c2c7] dark:border-[#5c3c3a]"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <Input
                {...register('email')}
                type="email"
                placeholder="Email or phone"
                error={errors.email?.message}
                autoComplete="email"
                disabled={isLoading}
                className="h-14 bg-white dark:bg-[#202124] border-[#dadce0] dark:border-[#3c4043] focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] rounded-md transition-all text-base"
              />

              <Input
                {...register('password')}
                type="password"
                placeholder="Enter your password"
                error={errors.password?.message}
                autoComplete="current-password"
                disabled={isLoading}
                className="h-14 bg-white dark:bg-[#202124] border-[#dadce0] dark:border-[#3c4043] focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] rounded-md transition-all text-base"
              />
            </div>

            <div className="flex items-center justify-between mt-2">
              <button
                type="button"
                className="text-sm font-medium text-[#1a73e8] dark:text-[#8ab4f8] hover:bg-[#f8f9fa] dark:hover:bg-[#303134] px-2 py-1 rounded transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <div className="flex items-center justify-between pt-8">
              <button
                type="button"
                className="text-sm font-medium text-[#1a73e8] dark:text-[#8ab4f8] hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-2 rounded transition-colors"
              >
                Create account
              </button>
              <Button
                type="submit"
                className="bg-[#1a73e8] dark:bg-[#8ab4f8] hover:bg-[#1557b0] dark:hover:bg-[#aecbfa] text-white dark:text-[#202124] px-6 h-10 rounded font-medium text-sm transition-all shadow-sm"
                isLoading={isLoading}
              >
                Next
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-6 flex items-center justify-between text-xs text-[#70757a] dark:text-[#9aa0a6] px-2">
          <div className="flex gap-4">
            <button className="hover:underline">English (United States)</button>
          </div>
          <div className="flex gap-6">
            <button className="hover:underline">Help</button>
            <button className="hover:underline">Privacy</button>
            <button className="hover:underline">Terms</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
