'use client';

import { useState, useEffect } from 'react';
import { useLiff } from '@/hooks/use-liff';
import { useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';

type Candidate = {
  id: string;
  date: string;
  votes: {
    id: string;
    user_id: string;
    availability: string;
    users: { display_name: string; picture_url: string | null };
  }[];
};

type Wish = {
  id: string;
  title: string;
};

const AVAILABILITY_OPTIONS = [
  { value: 'ok', label: '◯終日', color: 'emerald' },
  { value: 'morning', label: '午前', color: 'blue' },
  { value: 'afternoon', label: '午後', color: 'amber' },
  { value: 'evening', label: '夜', color: 'purple' },
  { value: 'ng', label: '×', color: 'red' },
  { value: 'undecided', label: '未定', color: 'slate' },
];

export default function VoteContent() {
  const { profile, isReady } = useLiff();
  const searchParams = useSearchParams();
  const params = useParams();
  const wishId = params.wishId as string;
  const groupId = searchParams.get('groupId');
  
  const [wish, setWish] = useState<Wish | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [myVotes, setMyVotes] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!groupId) return;
      try {
        // wish取得
        const wishRes = await fetch(`/api/groups/${groupId}/wishes`);
        const wishData = await wishRes.json();
        if (Array.isArray(wishData)) {
          const found = wishData.find((w: Wish) => w.id === wishId);
          if (found) setWish(found);
        }
        
        // 候補日取得
        const candRes = await fetch(`/api/wishes/${wishId}/schedule`);
        const candData = await candRes.json();
        if (Array.isArray(candData)) {
          setCandidates(candData);
          // 自分の投票を初期化
          const initial: Record<string, string> = {};
          candData.forEach((c: Candidate) => {
            const myVote = c.votes?.find(v => v.users?.display_name === profile?.displayName);
            initial[c.id] = myVote?.availability || '';
          });
          setMyVotes(initial);
        }
      } catch (err) { console.error(err); }
      finally { setIsLoading(false); }
    };
    if (isReady && profile) fetchData();
  }, [isReady, profile, groupId, wishId]);

  const handleVoteChange = (candidateId: string, availability: string) => {
    setMyVotes(prev => ({ ...prev, [candidateId]: availability }));
  };

  const handleSave = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      const votes = Object.entries(myVotes)
        .filter(([_, v]) => v)
        .map(([candidateId, availability]) => ({ candidateId, availability }));
      
      await fetch(`/api/wishes/${wishId}/schedule/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineUserId: profile.userId, votes })
      });
      
      // 再読み込み
      const candRes = await fetch(`/api/wishes/${wishId}/schedule`);
      const candData = await candRes.json();
      if (Array.isArray(candData)) setCandidates(candData);
    } catch (err) { console.error(err); alert('保存に失敗しました'); }
    finally { setIsSaving(false); }
  };

  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const dow = date.getDay();
    return { display: `${m}/${d}(${weekdays[dow]})`, isWeekend: dow === 0 || dow === 6, isSunday: dow === 0 };
  };

  const getVoteSummary = (candidate: Candidate) => {
    const summary: Record<string, number> = {};
    AVAILABILITY_OPTIONS.forEach(o => summary[o.value] = 0);
    candidate.votes?.forEach(v => {
      if (summary[v.availability] !== undefined) summary[v.availability]++;
    });
    return summary;
  };

  const getColorClass = (value: string, isSelected: boolean) => {
    const opt = AVAILABILITY_OPTIONS.find(o => o.value === value);
    if (!opt) return 'bg-slate-100 text-slate-600';
    if (!isSelected) return 'bg-slate-100 text-slate-600 hover:bg-slate-200';
    switch (opt.color) {
      case 'emerald': return 'bg-emerald-500 text-white';
      case 'blue': return 'bg-blue-500 text-white';
      case 'amber': return 'bg-amber-500 text-white';
      case 'purple': return 'bg-purple-500 text-white';
      case 'red': return 'bg-red-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  if (!isReady || isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" /></div>;

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
        {candidates.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
            <p className="text-slate-400">候補日がありません</p>
          </div>
        ) : (
          candidates.map((candidate) => {
            const { display, isSunday, isWeekend } = formatDate(candidate.date);
            const myVote = myVotes[candidate.id] || '';
            const summary = getVoteSummary(candidate);
            
            return (
              <div key={candidate.id} className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-semibold ${isSunday ? 'text-red-500' : isWeekend ? 'text-blue-500' : 'text-slate-900'}`}>
                    {display}
                  </span>
                  <div className="flex gap-1 text-xs">
                    {summary.ok > 0 && <span className="text-emerald-500">◯{summary.ok}</span>}
                    {summary.morning > 0 && <span className="text-blue-500">朝{summary.morning}</span>}
                    {summary.afternoon > 0 && <span className="text-amber-500">昼{summary.afternoon}</span>}
                    {summary.evening > 0 && <span className="text-purple-500">夜{summary.evening}</span>}
                    {summary.ng > 0 && <span className="text-red-500">×{summary.ng}</span>}
                  </div>
                </div>
                
                {/* 2段レイアウト */}
                <div className="grid grid-cols-3 gap-2">
                  {AVAILABILITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleVoteChange(candidate.id, myVote === opt.value ? '' : opt.value)}
                      className={`py-2 px-1 rounded-lg text-xs font-medium transition ${getColorClass(opt.value, myVote === opt.value)}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })
        )}

        {/* 回答者一覧 */}
        {candidates.length > 0 && candidates.some(c => c.votes?.length > 0) && (
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">回答状況</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="text-left py-2 pr-2 text-slate-500 font-normal">名前</th>
                    {candidates.map(c => {
                      const { display } = formatDate(c.date);
                      return <th key={c.id} className="text-center py-2 px-1 text-slate-500 font-normal whitespace-nowrap">{display.split('(')[0]}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const allUsers = new Set<string>();
                    candidates.forEach(c => c.votes?.forEach(v => allUsers.add(v.users?.display_name)));
                    return Array.from(allUsers).map(userName => (
                      <tr key={userName} className="border-t border-slate-100">
                        <td className="py-2 pr-2 text-slate-700 whitespace-nowrap">{userName}</td>
                        {candidates.map(c => {
                          const vote = c.votes?.find(v => v.users?.display_name === userName);
                          const opt = AVAILABILITY_OPTIONS.find(o => o.value === vote?.availability);
                          return (
                            <td key={c.id} className="text-center py-2 px-1">
                              {opt ? (
                                <span className={`inline-block w-6 h-6 leading-6 rounded text-white text-[10px] ${
                                  opt.color === 'emerald' ? 'bg-emerald-500' :
                                  opt.color === 'blue' ? 'bg-blue-500' :
                                  opt.color === 'amber' ? 'bg-amber-500' :
                                  opt.color === 'purple' ? 'bg-purple-500' :
                                  opt.color === 'red' ? 'bg-red-500' : 'bg-slate-500'
                                }`}>
                                  {opt.value === 'ok' ? '◯' : opt.value === 'ng' ? '×' : opt.label[0]}
                                </span>
                              ) : <span className="text-slate-300">-</span>}
                            </td>
                          );
                        })}
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`w-full py-3 rounded-xl text-sm font-semibold transition ${
            isSaving ? 'bg-slate-200 text-slate-400' : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          {isSaving ? '保存中...' : '回答を保存'}
        </button>
      </div>
    </div>
  );
}
