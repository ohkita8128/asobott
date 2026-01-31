export default function HowToUsePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🎩</div>
          <h1 className="text-xl font-bold text-slate-900">あそボットの使い方</h1>
          <p className="text-sm text-slate-500 mt-1">グループの予定調整をお手伝いします</p>
        </div>

        {/* 基本の流れ */}
        <section className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">■ 基本の流れ</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-7 h-7 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
              <div>
                <p className="font-medium text-slate-900 text-sm">行きたい場所を追加</p>
                <p className="text-xs text-slate-500 mt-0.5">みんなで候補を出し合おう</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-7 h-7 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <div>
                <p className="font-medium text-slate-900 text-sm">「行きたい！」ボタンで反応</p>
                <p className="text-xs text-slate-500 mt-0.5">興味ある人が集まる</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-7 h-7 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <div>
                <p className="font-medium text-slate-900 text-sm">日程調整を開始</p>
                <p className="text-xs text-slate-500 mt-0.5">◯△✕でかんたん投票</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-7 h-7 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
              <div>
                <p className="font-medium text-slate-900 text-sm">日程確定</p>
                <p className="text-xs text-slate-500 mt-0.5">当日を楽しむ！</p>
              </div>
            </div>
          </div>
        </section>

        {/* 管理画面の開き方 */}
        <section className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">■ 管理画面の開き方</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500">•</span>
              <span>下部メニューの「管理画面」をタップ</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500">•</span>
              <span>グループで「メニュー」と送信</span>
            </li>
          </ul>
        </section>

        {/* 通知について */}
        <section className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">■ 通知について</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500">•</span>
              <span>日程調整の開始</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500">•</span>
              <span>締め切りリマインド</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500">•</span>
              <span>日程確定のお知らせ</span>
            </li>
          </ul>
          <p className="text-xs text-slate-400 mt-3">※ 設定画面でON/OFFできます</p>
        </section>

        {/* できること */}
        <section className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">■ できること</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <div className="text-2xl mb-1">📝</div>
              <p className="text-xs text-slate-600">行きたいリスト管理</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <div className="text-2xl mb-1">📅</div>
              <p className="text-xs text-slate-600">日程調整</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <div className="text-2xl mb-1">✅</div>
              <p className="text-xs text-slate-600">参加確認</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <div className="text-2xl mb-1">🔔</div>
              <p className="text-xs text-slate-600">リマインド通知</p>
            </div>
          </div>
        </section>

        {/* お問い合わせ */}
        <div className="text-center pt-4">
          <p className="text-xs text-slate-400">ご不明な点はこちらまで</p>
          <a 
            href="mailto:asobott.official@gmail.com" 
            className="text-xs text-emerald-600 hover:underline"
          >
            asobott.official@gmail.com
          </a>
        </div>

        {/* フッター */}
        <div className="text-center pt-6 pb-4">
          <p className="text-xs text-slate-300">あそボット</p>
        </div>
      </div>
    </div>
  );
}
