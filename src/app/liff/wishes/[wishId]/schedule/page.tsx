import { Suspense } from 'react';
import ScheduleContent from './ScheduleContent';

export default function SchedulePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" /></div>}>
      <ScheduleContent />
    </Suspense>
  );
}
