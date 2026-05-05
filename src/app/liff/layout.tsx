'use client';

import { Suspense } from 'react';
import { SWRConfig } from 'swr';
import { ToastProvider } from './components/Toast';
import GroupHeader from './components/GroupHeader';

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
        <Suspense fallback={null}>
          <GroupHeader />
        </Suspense>
        {children}
      </ToastProvider>
    </SWRConfig>
  );
}
