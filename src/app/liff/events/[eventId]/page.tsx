import { Suspense } from 'react';
import EventDetailContent from './EventDetailContent';

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
    </div>
  );
}

export default async function EventDetailPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  
  return (
    <Suspense fallback={<Loading />}>
      <EventDetailContent eventId={eventId} />
    </Suspense>
  );
}
