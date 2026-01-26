'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuthFlow } from '../hooks/useAuthFlow';
import { Input, Button, Card } from '@/components/ui';

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
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (data: LoginFormValues) => {
    await handleLogin(data);
  };

  return (
    <div className="w-full max-w-[400px]">
      <Card className="p-8 shadow-lg border-border/40 bg-card/60 backdrop-blur-sm">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center mb-4 ring-1 ring-primary/20">
            <ShieldCheck className="w-6 h-6 text-primary" strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-bold text-foreground tracking-tight mb-1">
            Management Portal
          </h1>
          <p className="text-[12px] text-muted-foreground font-medium max-w-[280px] leading-relaxed">
            Secure administrative access for society operations and system infrastructure.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" autoComplete="off" noValidate>
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md border border-destructive/20 flex items-center gap-2.5">
              <AlertCircle size={14} className="shrink-0" />
              <p className="text-[10px] font-bold uppercase tracking-wide">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <Input
              {...register('email')}
              label="Administrative ID"
              type="email"
              placeholder="admin@system.io"
              error={errors.email?.message}
              data-1p-ignore
              disabled={isLoading}
              className="h-10 text-xs bg-secondary/20 border-border/50 focus:bg-background transition-all"
            />

            <div className="space-y-1.5">
              <Input
                {...register('password')}
                label="System Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                data-1p-ignore
                disabled={isLoading}
                className="h-10 text-xs bg-secondary/20 border-border/50 focus:bg-background transition-all"
              />
              <div className="flex justify-end pr-0.5">
                <button
                  type="button"
                  className="text-[9px] font-bold text-primary hover:text-primary transition-colors uppercase tracking-[0.1em]"
                >
                  Reset Credentials
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full h-10 rounded text-xs font-bold uppercase tracking-[0.15em] shadow-sm active:scale-100"
              isLoading={isLoading}
            >
              Secure Sign In
            </Button>
          </div>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50"></span>
            </div>
            <div className="relative flex justify-center text-[9px] uppercase font-bold tracking-[0.2em] text-muted-foreground/40">
              <span className="bg-card px-3">Audit Log Active</span>
            </div>
          </div>

          <Button
            variant="ghost"
            type="button"
            className="w-full h-10 rounded text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-secondary/30 transition-all border border-border/30"
            disabled={isLoading}
          >
            System Status
          </Button>
        </form>
      </Card>

      <div className="mt-8 pt-6 border-t border-border/30 w-full">
        <div className="grid grid-cols-3 text-center">
          <button className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50 hover:text-primary transition-colors">
            Compliance
          </button>
          <button className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50 hover:text-primary transition-colors">
            Governance
          </button>
          <button className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50 hover:text-primary transition-colors">
            Support
          </button>
        </div>
        <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30 text-center mt-6 tabular-nums">
          © 2026 SOCIETY MANAGEMENT • CONSOLE V5.0.0
        </p>
      </div>
    </div>
  );
};
