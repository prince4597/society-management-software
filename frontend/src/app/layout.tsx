import { AuthProvider } from '@/providers/AuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { SocketProvider } from '@/providers/SocketProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { RouteProgressBar } from '@/components/ui/RouteProgressBar';
import { GlobalErrorListener } from '@/components/infrastructure/GlobalErrorListener';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Society Management',
  description: 'Premium Production-grade Society Management Infrastructure',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <QueryProvider>
            <ToastProvider>
              <GlobalErrorListener />
              <AuthProvider>
                <SocketProvider>
                  <Suspense fallback={null}>
                    <RouteProgressBar />
                  </Suspense>
                  {children}
                </SocketProvider>
              </AuthProvider>
            </ToastProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
