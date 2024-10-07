'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { SessionProvider } from "next-auth/react";
import { useState } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster richColors position="top-right" closeButton />
        <ReactQueryDevtools client={queryClient} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
