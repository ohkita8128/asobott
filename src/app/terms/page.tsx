export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-200 p-6">
        <h1 className="text-xl font-bold text-slate-900 mb-6">あそボット 利用規約</h1>
        
        <div className="space-y-6 text-sm text-slate-700">
          <section>
            <h2 className="font-semibold text-slate-900 mb-2">第1条（サービス内容）</h2>
            <p>あそボットは、LINEグループでの予定調整をサポートするサービスです。</p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-2">第2条（取得する情報）</h2>
            <p>本サービスでは以下の情報を取得します。</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600">
              <li>LINEユーザーID</li>
              <li>表示名、プロフィール画像</li>
              <li>所属グループ情報</li>
              <li>本サービス内での投稿内容</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-2">第3条（利用目的）</h2>
            <p>取得した情報は以下の目的でのみ使用します。</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600">
              <li>予定調整機能の提供</li>
              <li>通知の送信</li>
              <li>サービス改善</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-2">第4条（第三者提供）</h2>
            <p>取得した情報は、法令に基づく場合を除き、第三者に提供いたしません。</p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-2">第5条（データの削除）</h2>
            <p>グループからボットを退出させた場合、当該グループに関するデータは削除されます。</p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-2">第6条（免責事項）</h2>
            <p>本サービスの利用により生じた損害について、運営者は責任を負いません。</p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-2">第7条（規約の変更）</h2>
            <p>本規約は予告なく変更することがあります。</p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-900 mb-2">第8条（お問い合わせ）</h2>
            <p>ご質問は下記までお願いいたします。</p>
            <p className="mt-2">
              <a 
                href="mailto:asobott.official@gmail.com" 
                className="text-blue-600 hover:underline"
              >
                asobott.official@gmail.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
          あそボット
        </div>
      </div>
    </div>
  );
}
