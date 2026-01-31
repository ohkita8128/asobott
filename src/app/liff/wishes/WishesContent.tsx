'use client';

import { useEffect, useState } from 'react';
import { useLiff } from '@/hooks/use-liff';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type WishResponse = {
  id: string;
  user_id: string;
  response: 'ok' | 'maybe' | 'ng';
  users: { display_name: string; picture_url: string | null };
};

type Wish = {
  id: string;
  title: string;
  description: string | null;
  is_anonymous: boolean;
  start_date: string | null;
  start_time: string | null;
  end_date: string | null;
  end_time: string | null;
  is_all_day: boolean;
  created_by_user: { display_name: string; picture_url: string | null } | null;
  interests: { id: string; user_id: string; users: { display_name: string; picture_url: string | null } }[];
  responses?: WishResponse[];
};

export default function WishesContent() {
  const { profile, context, isReady, error } = useLiff();
  const searchParams = useSearchParams();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [groupId, setGroupId] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroupId = async () => {
      try {
        const paramGroupId = searchParams.get('groupId');
        if (paramGroupId) { setGroupId(paramGroupId); return; }
        const isValidLineGroupId = context.groupId && context.groupId.startsWith('C');
        if (isValidLineGroupId) { 
          const res = await fetch(`/api/groups/by-line-id?lineGroupId=${context.groupId}`); 
          const data = await res.json(); 
          if (res.ok && data?.id) { setGroupId(data.id); return; } 
        }
        const res = await fetch(`/api/user-groups?lineUserId=${profile?.userId}`); 
        const data = await res.json();
        if (!res.ok) { setFetchError('エラー'); setIsLoading(false); return; }
        if (data && data.length > 0) setGroupId(data[0].group_id); 
        else { setFetchError('所属グループがありません'); setIsLoading(false); }
      } catch (err) { setFetchError('通信エラー'); setIsLoading(false); }
    };
    if (isReady && profile) fetchGroupId();
  }, [isReady, profile, context.groupId, searchParams]);

  const fetchWishes = async () => {
    if (!groupId) return;
    try { 
      const res = await fetch(`/api/groups/${groupId}/wishes`); 
      const data = await res.json(); 
      if (Array.isArray(data)) {
        // 各wishのresponsesを取得
        const withResponses = await Promise.all(data.map(async (wish: Wish) => {
          if (wish.start_date) {
            const resRes = await fetch(`/api/wishes/${wish.id}/response`);
            const responses = await resRes.json();
            return { ...wish, responses: Array.isArray(responses) ? responses : [] };
          }
          return { ...wish, responses: [] };
        }));
        setWishes(withResponses);
      }
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  useEffect(() => {
    fetchWishes();
  }, [groupId]);

  const toggleInterest = async (wishId: string, hasInterest: boolean) => {
    if (!profile) return;
    setSavingId(wishId);
    try {
      if (hasInterest) {
        await fetch(`/api/wishes/${wishId}/interest?lineUserId=${profile.userId}`, { method: 'DELETE' });
      } else {
        await fetch(`/api/wishes/${wishId}/interest`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lineUserId: profile.userId }) });
      }
      await fetchWishes();
    } catch (err) { console.error(err); }
    finally { setSavingId(null); }
  };

  const handleVote = async (wishId: string, vote: 'ok' | 'maybe' | 'ng') => {
    if (!profile) return;
    setSavingId(wishId);
    try {
      await fetch(`/api/wishes/${wishId}/response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineUserId: profile.userId, response: vote })
      });
      await fetchWishes();
    } catch (err) { console.error(err); }
    finally { setSavingId(null); }
  };

  const formatDateTime = (wish: Wish) => {
    if (!wish.start_date) return null;
    const [y, m, d] = wish.start_date.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    let str = `${m}/${d}(${weekdays[date.getDay()]})`;
    
    if (wish.is_all_day) {
      if (wish.start_date !== wish.end_date && wish.end_date) {
        const [ey, em, ed] = wish.end_date.split('-').map(Number);
        const edate = new Date(ey, em - 1, ed);
        str += ` 〜 ${em}/${ed}(${weekdays[edate.getDay()]})`;
      }
    } else {
      str += ` ${wish.start_time?.slice(0, 5) || ''}`;
      if (wish.end_time) {
        str += `〜${wish.end_time.slice(0, 5)}`;
      }
    }
    return str;
  };

  const getMyResponse = (wish: Wish): 'ok' | 'maybe' | 'ng' | null => {
    if (!profile || !wish.responses) return null;
    const myRes = wish.responses.find(r => r.users?.display_name === profile.displayName);
    return myRes?.response || null;
  };

  const getResponseCounts = (wish: Wish) => {
    if (!wish.responses) return { ok: 0, maybe: 0, ng: 0 };
    return {
      ok: wish.responses.filter(r => r.response === 'ok').length,
      maybe: wish.responses.filter(r => r.response === 'maybe').length,
      ng: wish.responses.filter(r => r.response === 'ng').length,
    };
  };

  if (!isReady || isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" /></div>;
  if (error || fetchError) return <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4"><div className="bg-white rounded-xl border p-6 text-center"><p className="text-slate-500">{error || fetchError}</p><Link href="/liff" className="inline-block mt-4 px-4 py-2 bg-slate-100 text-sm rounded-lg">戻る</Link></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="flex items-center gap-4">
          <Link href={`/liff?groupId=${groupId}`} className="text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="text-lg font-semibold text-slate-900">行きたいリスト</h1>
        </div>
      </header>

      <main className="px-4 py-6">
        {wishes.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
            <p className="text-slate-400 mb-4">まだ候補がありません</p>
            <Link href={`/liff/wishes/new?groupId=${groupId}`} className="inline-block px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg">最初の候補を追加</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {wishes.map((wish) => {
              const hasDateTime = !!wish.start_date;
              const hasInterest = wish.interests.some((i) => i.users?.display_name === profile?.displayName);
              const myResponse = getMyResponse(wish);
              const counts = getResponseCounts(wish);
              const isSaving = savingId === wish.id;
              
              return (
                <div key={wish.id} className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="mb-3">
                    <h3 className="font-semibold text-slate-900">{wish.title}</h3>
                    {hasDateTime && (
                      <p className="text-sm text-emerald-600 mt-1">📅 {formatDateTime(wish)}</p>
                    )}
                    {wish.description && <p className="text-sm text-slate-500 mt-1">{wish.description}</p>}
                  </div>

                  {hasDateTime ? (
                    // 日時あり: ◯△✕ボタン + 人数表示
                    <>
                      <div className="flex gap-2 mb-2">
                        {(['ok', 'maybe', 'ng'] as const).map((v) => (
                          <button
                            key={v}
                            onClick={() => handleVote(wish.id, v)}
                            disabled={isSaving}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                              myResponse === v
                                ? (v === 'ok' ? 'bg-emerald-500 text-white' : v === 'maybe' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white')
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {v === 'ok' ? '◯' : v === 'maybe' ? '△' : '✕'}
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-center gap-4 text-xs text-slate-400">
                        <span className="text-emerald-500">◯{counts.ok}</span>
                        <span className="text-amber-500">△{counts.maybe}</span>
                        <span className="text-red-500">✕{counts.ng}</span>
                      </div>
                    </>
                  ) : (
                    // 日時なし: 興味ありボタン
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">{wish.interests.length}人が興味あり</span>
                      <button 
                        onClick={() => toggleInterest(wish.id, hasInterest)} 
                        disabled={isSaving}
                        className={`px-4 py-1.5 text-sm font-medium rounded-lg transition ${
                          hasInterest 
                            ? 'bg-slate-100 text-slate-400' 
                            : 'bg-emerald-500 text-white hover:bg-emerald-600'
                        }`}
                      >
                        {hasInterest ? '✓' : '行きたい'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Link href={`/liff/wishes/new?groupId=${groupId}`} className="fixed bottom-24 right-4 w-12 h-12 bg-slate-900 text-white rounded-full shadow-lg flex items-center justify-center">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
      </Link>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200">
        <div className="flex justify-around py-2">
          <Link href={`/liff?groupId=${groupId}`} className="flex flex-col items-center py-1 px-3"><svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg><span className="text-xs text-slate-400 mt-1">ホーム</span></Link>
          <Link href={`/liff/calendar?groupId=${groupId}`} className="flex flex-col items-center py-1 px-3"><svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><span className="text-xs text-slate-400 mt-1">カレンダー</span></Link>
          <Link href={`/liff/wishes?groupId=${groupId}`} className="flex flex-col items-center py-1 px-3"><svg className="w-6 h-6 text-slate-900" fill="currentColor" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg><span className="text-xs text-slate-900 mt-1">行きたい</span></Link>
          <Link href={`/liff/settings?groupId=${groupId}`} className="flex flex-col items-center py-1 px-3"><svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg><span className="text-xs text-slate-400 mt-1">設定</span></Link>
        </div>
      </nav>
    </div>
  );
}
