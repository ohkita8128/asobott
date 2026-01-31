'use client';

import { useState, useEffect } from 'react';
import { useLiff } from '@/hooks/use-liff';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { authRequest } from '@/lib/swr/fetcher';
import Link from 'next/link';

export default function ScheduleContent() {
  const { profile, accessToken, isReady } = useLiff();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const wishId = params.wishId as string;
  const groupId = searchParams.get('groupId');
  
  const [wish, setWish] = useState<{ title: string } | null>(null);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deadline, setDeadline] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('23:59');

  useEffect(() => {
    const fetchWish = async () => {
      if (!groupId) return;
      try {
        const res = await fetch(`/api/groups/${groupId}/wishes`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const found = data.find((w: { id: string }) => w.id === wishId);
          if (found) setWish(found);
        }
      } catch (err) { console.error(err); }
      finally { setIsLoading(false); }
    };
    if (isReady) fetchWish();
  }, [isReady, groupId, wishId]);

  const handleSubmit = async () => {
    if (selectedDates.length === 0 || !profile) return;
    setIsSubmitting(true);
    try {
      const voteDeadline = deadline ? `${deadline}T${deadlineTime}:00` : null;
      await authRequest(`/api/wishes/${wishId}/schedule`, 'POST', accessToken, { dates: selectedDates.sort(), voteDeadline });
      router.push(`/liff/wishes/${wishId}/schedule/vote?groupId=${groupId}`);
    } catch (err) { alert('作成に失敗しました'); }
    finally { setIsSubmitting(false); }
  };

  const toggleDate = (dateStr: string) => {
    setSelectedDates(prev => {
      if (prev.includes(dateStr)) return prev.filter(d => d !== dateStr);
      if (prev.length >= 30) { alert('最大30日まで選択できます'); return prev; }
      return [...prev, dateStr];
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear(), month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
    return days;
  };

  const formatDateStr = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const isPast = (date: Date) => { const today = new Date(); today.setHours(0, 0, 0, 0); return date < today; };
  const isToday = (date: Date) => date.toDateString() === new Date().toDateString();
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  if (!isReady || isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" /></div>;

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="flex items-center gap-4">
          <Link href={`/liff/wishes?groupId=${groupId}`} className="text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">日程調整</h1>
            {wish && <p className="text-sm text-slate-500">{wish.title}</p>}
          </div>
        </div>
      </header>

      <main className="p-4 space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <label className="block text-sm font-medium text-slate-700 mb-3">候補日を選択（{selectedDates.length}/30）</label>
          
          <div className="flex items-center justify-between mb-4">
            <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-2 hover:bg-slate-100 rounded-lg">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <span className="text-sm font-medium text-slate-700">{currentMonth.getFullYear()}年 {currentMonth.getMonth() + 1}月</span>
            <button type="button" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-2 hover:bg-slate-100 rounded-lg">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekdays.map((day, i) => (
              <div key={day} className={`text-center text-xs font-medium py-1 ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-slate-400'}`}>{day}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              if (!date) return <div key={`empty-${index}`} className="aspect-square" />;
              const dateStr = formatDateStr(date);
              const isSelected = selectedDates.includes(dateStr);
              const past = isPast(date);
              const todayCheck = isToday(date);
              const dow = date.getDay();
              return (
                <button
                  key={dateStr}
                  type="button"
                  disabled={past}
                  onClick={() => toggleDate(dateStr)}
                  className={`aspect-square rounded-lg text-sm font-medium transition ${
                    past ? 'text-slate-200 cursor-not-allowed' 
                    : isSelected ? 'bg-emerald-500 text-white' 
                    : todayCheck ? 'bg-slate-100 text-slate-900' 
                    : dow === 0 ? 'text-red-500 hover:bg-red-50' 
                    : dow === 6 ? 'text-blue-500 hover:bg-blue-50' 
                    : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        {selectedDates.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-medium text-slate-700 mb-2">選択中の日程</p>
            <div className="flex flex-wrap gap-2">
              {selectedDates.sort().map((dateStr) => {
                const [y, m, d] = dateStr.split('-').map(Number);
                const date = new Date(y, m - 1, d);
                return (
                  <span key={dateStr} className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-sm rounded-lg">
                    {m}/{d}({weekdays[date.getDay()]})
                    <button type="button" onClick={() => toggleDate(dateStr)} className="hover:text-emerald-900">×</button>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* 締め切り設定 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <label className="block text-sm font-medium text-slate-700 mb-3">回答締め切り（任意）</label>
          <div className="flex gap-2">
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={minDate}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
            <input
              type="time"
              value={deadlineTime}
              onChange={(e) => setDeadlineTime(e.target.value)}
              className="w-24 px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          {deadline && (
            <button
              type="button"
              onClick={() => { setDeadline(''); setDeadlineTime('23:59'); }}
              className="mt-2 text-xs text-slate-400 hover:text-slate-600"
            >
              締め切りを削除
            </button>
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4">
        <button
          onClick={handleSubmit}
          disabled={selectedDates.length === 0 || isSubmitting}
          className={`w-full py-3 rounded-xl text-sm font-semibold transition ${
            selectedDates.length === 0 || isSubmitting
              ? 'bg-slate-200 text-slate-400'
              : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          {isSubmitting ? '作成中...' : `${selectedDates.length}日で投票を作成`}
        </button>
      </div>
    </div>
  );
}
