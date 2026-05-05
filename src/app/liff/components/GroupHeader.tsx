'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useGroup } from '@/hooks/use-group';

export default function GroupHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { groupId, groupName, setGroupId, setGroupName, allGroups } = useGroup();
  const [showSheet, setShowSheet] = useState(false);

  if (pathname === '/liff/groups') return null;
  if (!groupId) return null;

  const switchGroup = (newGroupId: string, newGroupName: string | null) => {
    setGroupId(newGroupId);
    setGroupName(newGroupName);
    setShowSheet(false);
    // wish詳細ページは別グループに存在しないのでホームへ。それ以外は現在のページに留まる
    const isWishDetail = /^\/liff\/wishes\/[^/]+\/(confirm|edit|schedule)/.test(pathname);
    const targetPath = isWishDetail ? '/liff' : pathname;
    router.push(`${targetPath}?groupId=${newGroupId}`);
  };

  return (
    <>
      <div className="sticky top-0 z-30 bg-slate-100/95 backdrop-blur border-b border-slate-200 px-4 py-1.5">
        <button
          onClick={() => setShowSheet(true)}
          className="flex items-center gap-1.5 text-xs text-slate-600 mx-auto"
        >
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="max-w-[220px] truncate font-medium">{groupName || 'グループ'}</span>
          <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {showSheet && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSheet(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[70vh] overflow-hidden animate-slide-up">
            <div className="p-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">グループを選択</h2>
                <button onClick={() => setShowSheet(false)} className="p-2 text-slate-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[calc(70vh-140px)]">
              {allGroups.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-sm text-slate-500">グループがありません</p>
                </div>
              ) : (
                allGroups.map((g) => (
                  <button
                    key={g.group_id}
                    onClick={() => switchGroup(g.group_id, g.groups?.name || null)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 border-b border-slate-100"
                  >
                    <span className="text-sm text-slate-700">{g.groups?.name || '名前なし'}</span>
                    {g.group_id === groupId && (
                      <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    )}
                  </button>
                ))
              )}
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-200">
              <p className="text-xs text-slate-500">
                💡 グループが表示されない場合は、<span className="font-medium">グループトークから</span>管理画面を開くか、グループで何かメッセージを送ってください。
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
