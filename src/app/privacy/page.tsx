import Link from 'next/link';

export const metadata = {
  title: 'プライバシーポリシー - あそボット',
  description: 'あそボットのプライバシーポリシーです。',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/lp" className="flex items-center gap-2">
            <span className="text-2xl">🎩</span>
            <span className="font-bold text-slate-900">あそボット</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">プライバシーポリシー</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 mb-8">
            あそボット（以下「本サービス」といいます）は、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます）を定めます。
          </p>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">第1条（収集する情報）</h2>
            <p className="text-slate-600 mb-4">本サービスは、以下の情報を収集します。</p>
            <ol className="list-decimal pl-6 text-slate-600 space-y-2">
              <li>
                <strong>LINEアカウント情報</strong>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>LINEユーザーID</li>
                  <li>表示名（ニックネーム）</li>
                  <li>プロフィール画像URL</li>
                </ul>
              </li>
              <li>
                <strong>LINEグループ情報</strong>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>グループID</li>
                  <li>グループ名</li>
                </ul>
              </li>
              <li>
                <strong>サービス利用情報</strong>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>ユーザーが登録した「行きたい場所」の情報</li>
                  <li>日程調整における投票情報</li>
                  <li>参加確認における回答情報</li>
                  <li>通知設定情報</li>
                </ul>
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">第2条（収集しない情報）</h2>
            <p className="text-slate-600 mb-4">本サービスは、以下の情報を収集・保存しません。</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>LINEグループ内のメッセージ内容（コマンドへの応答を除く）</li>
              <li>ユーザーの電話番号、メールアドレス</li>
              <li>位置情報</li>
              <li>デバイス情報</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">第3条（利用目的）</h2>
            <p className="text-slate-600 mb-4">本サービスは、収集した情報を以下の目的で利用します。</p>
            <ol className="list-decimal pl-6 text-slate-600 space-y-2">
              <li>本サービスの提供・運営のため</li>
              <li>ユーザーからのお問い合わせに対応するため</li>
              <li>本サービスの改善・新機能開発のため</li>
              <li>利用規約に違反したユーザーの特定および利用制限のため</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">第4条（第三者提供）</h2>
            <p className="text-slate-600 mb-4">
              本サービスは、以下の場合を除き、ユーザーの同意なく個人情報を第三者に提供することはありません。
            </p>
            <ol className="list-decimal pl-6 text-slate-600 space-y-2">
              <li>法令に基づく場合</li>
              <li>人の生命、身体または財産の保護のために必要がある場合であって、ユーザーの同意を得ることが困難である場合</li>
              <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、ユーザーの同意を得ることが困難である場合</li>
              <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、ユーザーの同意を得ることにより当該事務の遂行に支障を及ぼすおそれがある場合</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">第5条（データの保管）</h2>
            <ol className="list-decimal pl-6 text-slate-600 space-y-2">
              <li>本サービスは、収集した情報を適切なセキュリティ対策を講じたサーバーに保管します。</li>
              <li>グループから本サービスが退会させられた場合、当該グループに関連するデータは削除されます。</li>
              <li>ユーザーが本サービスをブロックした場合、当該ユーザーの個人情報は保持されますが、ユーザーからの削除要請があった場合は速やかに削除します。</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">第6条（情報の開示・訂正・削除）</h2>
            <ol className="list-decimal pl-6 text-slate-600 space-y-2">
              <li>ユーザーは、本サービスに対して自己の個人情報の開示を求めることができます。</li>
              <li>ユーザーは、本サービスに対して自己の個人情報の訂正または削除を求めることができます。</li>
              <li>開示・訂正・削除の請求は、以下のお問い合わせ先までご連絡ください。</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">第7条（外部サービスの利用）</h2>
            <p className="text-slate-600 mb-4">本サービスは、以下の外部サービスを利用しています。</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>
                <strong>LINE Messaging API</strong>：LINEとの連携に使用
                <br />
                <a href="https://line.me/ja/terms/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                  LINE利用規約
                </a>
              </li>
              <li>
                <strong>Supabase</strong>：データベースサービス
                <br />
                <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                  Supabase Privacy Policy
                </a>
              </li>
              <li>
                <strong>Vercel</strong>：ホスティングサービス
                <br />
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                  Vercel Privacy Policy
                </a>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">第8条（プライバシーポリシーの変更）</h2>
            <ol className="list-decimal pl-6 text-slate-600 space-y-2">
              <li>本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく変更することができるものとします。</li>
              <li>本サービスが別途定める場合を除いて、変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">第9条（お問い合わせ窓口）</h2>
            <p className="text-slate-600">
              本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします。
            </p>
            <div className="bg-slate-50 rounded-lg p-4 mt-4">
              <p className="text-slate-600">
                メールアドレス：
                <a href="mailto:asobott.official@gmail.com" className="text-emerald-600 hover:underline">
                  asobott.official@gmail.com
                </a>
              </p>
            </div>
          </section>

          <p className="text-slate-500 text-sm mt-12">
            制定日：2025年1月1日<br />
            最終更新日：2025年1月1日
          </p>
        </div>
      </main>

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
