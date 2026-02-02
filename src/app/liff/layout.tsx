'use client';

import { SWRConfig } from 'swr';
import { ToastProvider } from './components/Toast';

export default function LiffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SWRConfig 
      value={{
        revalidateOnFocus: false,
        dedupingInterval: 5000,
        revalidateOnReconnect: false,
      }}
    >
      <ToastProvider>
        {children}
      </ToastProvider>
    </SWRConfig>
  );
}
