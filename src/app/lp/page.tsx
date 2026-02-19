import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'あそボット - LINEグループの予定調整をもっと簡単に',
  description: 'グループの「いつか行きたいね」を「この日に行こう！」に変えるLINE Bot。行きたい場所の共有から日程調整、参加確認まで、グループの予定調整をスムーズにサポートします。',
};

const LineSvg = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.349 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
  </svg>
);

function ScreenshotCard({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-56 md:w-64 overflow-hidden rounded-2xl shadow-lg border border-slate-200">
        <div className="overflow-hidden" style={{ margin: '-6% 0 -2% 0' }}>
          <Image src={src} alt={alt} width={750} height={1624} className="w-full h-auto" />
        </div>
      </div>
      <p className="text-sm font-medium text-slate-600">{caption}</p>
    </div>
  );
}

export default function LandingPage() {
  const botFriendUrl = process.env.LINE_BOT_FRIEND_URL || 'https://lin.ee/xxxxx';

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/icons/butler-icon.png" alt="あそじぃ" width={36} height={36} className="rounded-full" />
            <span className="font-bold text-slate-900">あそボット</span>
          </div>
          <a
            href={botFriendUrl}
            className="bg-[#06C755] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#05b34d] transition flex items-center gap-1.5"
          >
            <LineSvg className="w-4 h-4" />
            友だち追加
          </a>
        </div>
      </header>

      {/* ヒーロー */}
      <section className="bg-gradient-to-b from-emerald-50 to-white py-12 md:py-20 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* キャラクター */}
          <div className="relative flex-shrink-0">
            {/* 背景ブロブ */}
            <div className="absolute inset-0 -inset-x-6 -inset-y-4">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 md:w-72 md:h-72 bg-emerald-100 rounded-full blur-2xl opacity-60" />
            </div>
            <div className="relative flex items-end gap-3 md:gap-5">
              <div className="w-28 h-28 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-white shadow-xl bg-[#f5f0e8]">
                <Image
                  src="/icons/butler-icon.png"
                  alt="あそじぃ"
                  width={180}
                  height={180}
                  className="w-full h-full object-cover scale-110"
                />
              </div>
              <div className="w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white -ml-4 md:-ml-6">
                <Image
                  src="/icons/penguin-icon.png"
                  alt="あそぺん"
                  width={140}
                  height={140}
                  className="w-full h-full object-cover scale-105"
                />
              </div>
            </div>
          </div>
          {/* テキスト */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
              「いつか行きたいね」を<br />
              <span className="text-emerald-600">「この日に行こう！」</span>へ
            </h1>
            <p className="text-lg text-slate-600 mb-6">
              LINEグループの予定調整をもっと簡単に。<br />
              行きたい場所の共有から日程調整まで、あそボットがサポートします。
            </p>
            <a
              href={botFriendUrl}
              className="inline-flex items-center justify-center gap-2 bg-[#06C755] text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-[#05b34d] transition shadow-lg"
            >
              <LineSvg className="w-6 h-6" />
              友だち追加する
            </a>
            <p className="text-sm text-slate-400 mt-3">無料でご利用いただけます</p>
          </div>
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

      {/* 画面紹介 */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-4">
            LINEだけでここまでできる
          </h2>
          <p className="text-slate-500 text-center mb-12">アプリのインストール不要。LINEの中で完結します。</p>
          <div className="flex flex-col md:flex-row items-start justify-center gap-8 md:gap-10">
            <ScreenshotCard
              src="/screenshots/home.png"
              alt="ホーム画面"
              caption="予定も人気の行き先も一目でわかる"
            />
            <ScreenshotCard
              src="/screenshots/wishlist.png"
              alt="行きたいリスト"
              caption="みんなの「行きたい！」が集まる"
            />
            <ScreenshotCard
              src="/screenshots/line-chat.png"
              alt="LINEトーク画面"
              caption="LINEから直接操作できる"
            />
          </div>
        </div>
      </section>

      {/* キャラクター紹介 */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-4">
            2つのキャラクターから選べる
          </h2>
          <p className="text-slate-500 text-center mb-12">グループの雰囲気に合わせて、いつでも切り替えOK</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div className="relative mx-auto mb-5 w-28 h-28">
                <div className="absolute inset-0 bg-amber-100 rounded-full blur-lg opacity-50" />
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-amber-50 shadow-md bg-[#f5f0e8]">
                  <Image
                    src="/icons/butler-icon.png"
                    alt="あそじぃ"
                    width={120}
                    height={120}
                    className="w-full h-full object-cover scale-110"
                  />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">あそじぃ</h3>
              <p className="text-sm text-slate-500 mb-4">丁寧な執事キャラ</p>
              <div className="bg-amber-50 rounded-xl p-4 text-left border border-amber-100">
                <p className="text-sm text-slate-600 italic">
                  「皆様の行きたい場所、わたくしがお預かりいたします。大事なときだけ、そっとお声がけいたしますね。」
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div className="relative mx-auto mb-5 w-28 h-28">
                <div className="absolute inset-0 bg-sky-100 rounded-full blur-lg opacity-50" />
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-sky-50 shadow-md bg-white">
                  <Image
                    src="/icons/penguin-icon.png"
                    alt="あそぺん"
                    width={120}
                    height={120}
                    className="w-full h-full object-cover scale-105"
                  />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">あそぺん</h3>
              <p className="text-sm text-slate-500 mb-4">にぎやかなペンギン</p>
              <div className="bg-sky-50 rounded-xl p-4 text-left border border-sky-100">
                <p className="text-sm text-slate-600 italic">
                  「みんなの行きたい場所、覚えておくよ！盛り上がってきたら声かけるね！」
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 使い方 */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">
            使い方はかんたん
          </h2>
          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">1</div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">あそボットを友だち追加</h3>
                <p className="text-slate-600">まずはあそボットを友だちに追加してください。</p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">2</div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">グループに招待</h3>
                <p className="text-slate-600">予定調整したいLINEグループにあそボットを招待します。</p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">3</div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">行きたい場所を追加</h3>
                <p className="text-slate-600">管理画面から「行きたい場所」を追加。メンバーも自由に追加できます。</p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">4</div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">日程調整して確定！</h3>
                <p className="text-slate-600">盛り上がったら日程調整を開始。みんなの都合を集めて日程を確定します。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 安心ポイント */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">
            安心してお使いいただけます
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">🔒</div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">トークの内容は一切見ません</h3>
                <p className="text-sm text-slate-600">グループ内のメッセージは保存も閲覧もしません。「メニュー」等のコマンドにだけ反応します。</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">✨</div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">完全無料</h3>
                <p className="text-sm text-slate-600">すべての機能を無料でご利用いただけます。</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">📱</div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">アプリ不要</h3>
                <p className="text-sm text-slate-600">LINEだけで完結。新しいアプリのインストールは不要です。</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl flex-shrink-0">👋</div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">いつでも退会OK</h3>
                <p className="text-sm text-slate-600">グループから退会させるだけ。データもすべて削除されます。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-emerald-600">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-3 mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/40 shadow-lg bg-[#f5f0e8]">
              <Image src="/icons/butler-icon.png" alt="あそじぃ" width={64} height={64} className="w-full h-full object-cover scale-110" />
            </div>
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/40 shadow-lg bg-white -ml-3">
              <Image src="/icons/penguin-icon.png" alt="あそぺん" width={64} height={64} className="w-full h-full object-cover scale-105" />
            </div>
          </div>
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
            <LineSvg className="w-6 h-6" />
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
              <Image src="/icons/butler-icon.png" alt="あそじぃ" width={24} height={24} className="rounded-full" />
              <span className="text-white font-medium">あそボット</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/terms" className="hover:text-white transition">利用規約</Link>
              <Link href="/privacy" className="hover:text-white transition">プライバシーポリシー</Link>
              <a href="mailto:asobott.official@gmail.com" className="hover:text-white transition">お問い合わせ</a>
            </div>
          </div>
          <div className="text-center mt-8 text-sm">
            &copy; 2025 あそボット. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
