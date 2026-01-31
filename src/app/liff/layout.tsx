'use client';

import { ToastProvider } from './components/Toast';

export default function LiffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}
