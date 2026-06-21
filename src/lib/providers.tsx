'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Toaster as SonnerToaster } from 'sonner';
import { AuthProvider } from '@/hooks/useAuth';
import { ThemeProvider } from '@/hooks/useTheme';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 1000 * 60,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--card-border)',
                backdropFilter: 'blur(12px)',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: {
                iconTheme: {
                  primary: 'var(--success)',
                  secondary: 'var(--bg-primary)',
                },
              },
              error: {
                iconTheme: {
                  primary: 'var(--danger)',
                  secondary: 'var(--bg-primary)',
                },
              },
            }}
          />
          <SonnerToaster position="top-right" richColors toastOptions={{
            style: {
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--card-border)',
              borderRadius: '12px',
            }
          }} />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
