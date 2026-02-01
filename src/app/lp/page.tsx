import Link from 'next/link';

export const metadata = {
  title: 'あそボット - LINEグループの予定調整をもっと簡単に',
  description: 'グループの「いつか行きたいね」を「この日に行こう！」に変えるLINE Bot。行きたい場所の共有から日程調整、参加確認まで、グループの予定調整をスムーズにサポートします。',
};

export default function LandingPage() {
  const botFriendUrl = process.env.LINE_BOT_FRIEND_URL || 'https://lin.ee/xxxxx';

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎩</span>
            <span className="font-bold text-slate-900">あそボット</span>
          </div>
          <a
            href={botFriendUrl}
            className="bg-[#06C755] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#05b34d] transition"
          >
            友だち追加
          </a>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="bg-gradient-to-b from-emerald-50 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">🎩</div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            「いつか行きたいね」を<br />
            <span className="text-emerald-600">「この日に行こう！」</span>へ
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            LINEグループの予定調整をもっと簡単に。<br />
            行きたい場所の共有から日程調整まで、あそボットがサポートします。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={botFriendUrl}
              className="inline-flex items-center justify-center gap-2 bg-[#06C755] text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-[#05b34d] transition shadow-lg"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.349 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
              友だち追加する
            </a>
          </div>
          <p className="text-sm text-slate-400 mt-4">無料でご利用いただけます</p>
        </div>
      </section>

      {/* 課題提起 */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
            こんな経験、ありませんか？
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-3">😅</div>
              <p className="text-slate-600">「いつか焼肉行こう」と言ったまま、3ヶ月経過...</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-3">📅</div>
              <p className="text-slate-600">日程調整が面倒で、結局誰も言い出さない</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-3xl mb-3">💬</div>
              <p className="text-slate-600">LINEで「いつがいい？」の会話が流れてしまう</p>
            </div>
          </div>
        </div>
      </section>

      {/* 解決策 */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            あそボットが解決します
          </h2>
          <p className="text-slate-600 mb-12">
            LINEグループに招待するだけ。面倒な予定調整をスムーズに。
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="font-medium text-slate-900 mb-2">行きたいリスト</h3>
              <p className="text-sm text-slate-500">みんなで「行きたい場所」を出し合える</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🙋</span>
              </div>
              <h3 className="font-medium text-slate-900 mb-2">興味の可視化</h3>
              <p className="text-sm text-slate-500">「行きたい！」ボタンで盛り上がりがわかる</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="font-medium text-slate-900 mb-2">日程調整</h3>
              <p className="text-sm text-slate-500">候補日に◯×で簡単投票</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔔</span>
              </div>
              <h3 className="font-medium text-slate-900 mb-2">リマインド</h3>
              <p className="text-sm text-slate-500">締め切り前に自動でお知らせ</p>
            </div>
          </div>
        </div>
      </section>

      {/* 使い方 */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">
            使い方はかんたん
          </h2>
          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">1</div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">あそボットを友だち追加</h3>
                <p className="text-slate-600">まずはあそボットを友だちに追加してください。</p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">2</div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">グループに招待</h3>
                <p className="text-slate-600">予定調整したいLINEグループにあそボットを招待します。</p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">3</div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">行きたい場所を追加</h3>
                <p className="text-slate-600">管理画面から「行きたい場所」を追加。メンバーも自由に追加できます。</p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">4</div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">日程調整して確定！</h3>
                <p className="text-slate-600">盛り上がったら日程調整を開始。みんなの都合を集めて日程を確定します。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 特徴 */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">
            あそボットの特徴
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="text-3xl">✨</div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">完全無料</h3>
                <p className="text-sm text-slate-600">すべての機能を無料でご利用いただけます。</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">📱</div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">アプリ不要</h3>
                <p className="text-sm text-slate-600">LINEだけで完結。新しいアプリのインストールは不要です。</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">👥</div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">グループで使える</h3>
                <p className="text-sm text-slate-600">友達グループ、サークル、同期会など、どんなグループでも。</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">🔒</div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">プライバシー保護</h3>
                <p className="text-sm text-slate-600">必要最小限の情報のみ取得。メッセージ内容は保存しません。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-emerald-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            さっそく始めてみませんか？
          </h2>
          <p className="text-emerald-100 mb-8">
            友だち追加して、グループに招待するだけ。
          </p>
          <a
            href={botFriendUrl}
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-600 px-8 py-4 rounded-xl text-lg font-medium hover:bg-emerald-50 transition shadow-lg"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.349 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
            </svg>
            友だち追加する
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">
            よくある質問
          </h2>
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-2">Q. 本当に無料ですか？</h3>
              <p className="text-slate-600">はい、すべての機能を無料でご利用いただけます。</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-2">Q. グループのメッセージは見られますか？</h3>
              <p className="text-slate-600">いいえ。あそボットはメッセージの内容を保存・閲覧しません。コマンド（「メニュー」等）への応答のみ行います。</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-2">Q. 複数のグループで使えますか？</h3>
              <p className="text-slate-600">はい、複数のグループにあそボットを招待して、それぞれで予定調整できます。</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-2">Q. グループから退会させるとデータは消えますか？</h3>
              <p className="text-slate-600">はい、グループから退会させると、そのグループのデータは削除されます。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 運営情報 */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
            運営情報
          </h2>
          <div className="bg-white rounded-xl p-8 max-w-md mx-auto">
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-slate-500">サービス名</dt>
                <dd className="font-medium text-slate-900">あそボット</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">運営</dt>
                <dd className="font-medium text-slate-900">個人開発</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">お問い合わせ</dt>
                <dd className="font-medium text-slate-900">
                  <a href="mailto:asobott.official@gmail.com" className="text-emerald-600 hover:underline">
                    asobott.official@gmail.com
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎩</span>
              <span className="text-white font-medium">あそボット</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/terms" className="hover:text-white transition">利用規約</Link>
              <Link href="/privacy" className="hover:text-white transition">プライバシーポリシー</Link>
              <a href="mailto:asobott.official@gmail.com" className="hover:text-white transition">お問い合わせ</a>
            </div>
          </div>
          <div className="text-center mt-8 text-sm">
            © 2025 あそボット. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
