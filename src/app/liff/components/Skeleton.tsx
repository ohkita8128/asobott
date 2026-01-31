'use client';

// 汎用スケルトン
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
  );
}

// カードスケルトン（行きたいリスト用）
export function WishCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-start gap-3">
        <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="w-16 h-8 rounded-lg" />
      </div>
    </div>
  );
}

// リストスケルトン
export function WishListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <WishCardSkeleton key={i} />
      ))}
    </div>
  );
}

// カレンダースケルトン
export function CalendarSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="w-8 h-8 rounded" />
        <Skeleton className="w-24 h-5" />
        <Skeleton className="w-8 h-8 rounded" />
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-6 rounded" />
        ))}
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton key={`day-${i}`} className="aspect-square rounded" />
        ))}
      </div>
    </div>
  );
}

// ホーム画面スケルトン
export function HomeSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {/* おすすめセクション */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <Skeleton className="h-5 w-32 mb-3" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
      
      {/* カレンダー */}
      <CalendarSkeleton />
      
      {/* 行きたいリスト */}
      <div>
        <Skeleton className="h-5 w-24 mb-3" />
        <WishListSkeleton count={2} />
      </div>
    </div>
  );
}

// ページ全体のローディング
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-9 h-9 rounded-lg" />
            <div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16 mt-1" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>
        </div>
      </div>
      
      {/* コンテンツ */}
      <HomeSkeleton />
    </div>
  );
}
