import { Suspense } from 'react';
import WishesContent from './WishesContent';

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
    </div>
  );
}

export default function WishesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <WishesContent />
    </Suspense>
  );
}
