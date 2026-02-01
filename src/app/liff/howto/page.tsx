export default function HowToUsePage() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🎩</div>
          <h1 className="text-xl font-bold text-slate-900">あそボットの使い方</h1>
          <p className="text-sm text-slate-500 mt-1">「いつか行きたいね」を「この日に行こう！」へ</p>
        </div>

        {/* 目次 */}
        <section className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">📖 目次</h2>
          <ul className="space-y-2 text-sm">
            <li><a href="#flow" className="text-emerald-600 hover:underline">基本の流れ</a></li>
            <li><a href="#add-wish" className="text-emerald-600 hover:underline">行きたい場所を追加する</a></li>
            <li><a href="#interest" className="text-emerald-600 hover:underline">「行きたい！」ボタンとは</a></li>
            <li><a href="#schedule" className="text-emerald-600 hover:underline">日程調整のやり方</a></li>
            <li><a href="#confirm" className="text-emerald-600 hover:underline">参加確認のやり方</a></li>
            <li><a href="#notification" className="text-emerald-600 hover:underline">通知について</a></li>
            <li><a href="#open" className="text-emerald-600 hover:underline">管理画面の開き方</a></li>
            <li><a href="#faq" className="text-emerald-600 hover:underline">よくある質問</a></li>
          </ul>
        </section>

        {/* 基本の流れ */}
        <section id="flow" className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">■ 基本の流れ</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-7 h-7 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
              <div>
                <p className="font-medium text-slate-900 text-sm">行きたい場所を追加</p>
                <p className="text-xs text-slate-500 mt-0.5">誰でも候補を追加できます</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-7 h-7 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <div>
                <p className="font-medium text-slate-900 text-sm">「行きたい！」で興味を表明</p>
                <p className="text-xs text-slate-500 mt-0.5">人数が集まったら盛り上がりのサイン</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-7 h-7 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <div>
                <p className="font-medium text-slate-900 text-sm">日程調整で候補日を決める</p>
                <p className="text-xs text-slate-500 mt-0.5">みんなの都合を集めます</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-7 h-7 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
              <div>
                <p className="font-medium text-slate-900 text-sm">日程を確定</p>
                <p className="text-xs text-slate-500 mt-0.5">作成者が最終決定します</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-7 h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
              <div>
                <p className="font-medium text-slate-900 text-sm">参加確認</p>
                <p className="text-xs text-slate-500 mt-0.5">確定した予定の出欠を確認</p>
              </div>
            </div>
          </div>
        </section>

        {/* 行きたい場所を追加 */}
        <section id="add-wish" className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">■ 行きたい場所を追加する</h2>
          <div className="space-y-3 text-sm text-slate-600">
            <p>ホーム画面の「行きたい追加」または、行きたいリスト右下の「＋」ボタンから追加できます。</p>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="font-medium text-slate-700 text-xs mb-2">入力できる項目</p>
              <ul className="text-xs space-y-1 text-slate-500">
                <li>• タイトル（必須）</li>
                <li>• 説明（任意）</li>
                <li>• 日時（任意）- 決まっていれば入力</li>
              </ul>
            </div>
            <p className="text-xs text-slate-400">💡 日時が未定でもOK。あとで日程調整できます。</p>
          </div>
        </section>

        {/* 行きたい！ボタン */}
        <section id="interest" className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">■ 「行きたい！」ボタンとは</h2>
          <div className="space-y-3 text-sm text-slate-600">
            <p>その場所に興味があることを伝えるボタンです。</p>
            <div className="bg-emerald-50 rounded-lg p-3">
              <p className="font-medium text-emerald-700 text-xs">ポイント</p>
              <ul className="text-xs space-y-1 text-emerald-600 mt-1">
                <li>• 人数が多いほど人気の証拠</li>
                <li>• 盛り上がったらあそボットがお知らせ</li>
                <li>• もう一度押すと取り消せます</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 日程調整 */}
        <section id="schedule" className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">■ 日程調整のやり方</h2>
          <div className="space-y-3 text-sm text-slate-600">
            <p>日時が決まっていない候補の日程を決める機能です。</p>
            
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="font-medium text-slate-700 text-xs mb-2">始め方</p>
              <p className="text-xs text-slate-500">行きたいリストで「日程調整を開始」をタップ → カレンダーから候補日を選択</p>
            </div>

            <div className="bg-slate-50 rounded-lg p-3">
              <p className="font-medium text-slate-700 text-xs mb-2">回答の種類</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-emerald-500 text-white text-xs rounded flex items-center justify-center">◯</span>
                  <span className="text-xs text-slate-600">参加できる</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-red-500 text-white text-xs rounded flex items-center justify-center">×</span>
                  <span className="text-xs text-slate-600">参加できない</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-slate-500 text-white text-xs rounded flex items-center justify-center">?</span>
                  <span className="text-xs text-slate-600">未定</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-500 text-white text-xs rounded flex items-center justify-center">前</span>
                  <span className="text-xs text-slate-600">午前なら◯</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-amber-500 text-white text-xs rounded flex items-center justify-center">後</span>
                  <span className="text-xs text-slate-600">午後なら◯</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-purple-500 text-white text-xs rounded flex items-center justify-center">夜</span>
                  <span className="text-xs text-slate-600">夜なら◯</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg p-3">
              <p className="font-medium text-amber-700 text-xs">⚠️ 回答後は「回答を保存」を押してください</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-3">
              <p className="font-medium text-blue-700 text-xs">日程の確定</p>
              <p className="text-xs text-blue-600 mt-1">作成者のみ「この日に確定」ボタンが表示されます。確定するとグループに通知が届きます。</p>
            </div>
          </div>
        </section>

        {/* 参加確認 */}
        <section id="confirm" className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">■ 参加確認のやり方</h2>
          <div className="space-y-3 text-sm text-slate-600">
            <p>日程が確定した予定の出欠を確認する機能です。</p>
            
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="font-medium text-slate-700 text-xs mb-2">回答の種類</p>
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-emerald-500 text-white text-xs rounded flex items-center justify-center">◯</span>
                  <span className="text-xs text-slate-600">参加します</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-amber-500 text-white text-xs rounded flex items-center justify-center">△</span>
                  <span className="text-xs text-slate-600">まだわからない</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-red-500 text-white text-xs rounded flex items-center justify-center">×</span>
                  <span className="text-xs text-slate-600">参加できません</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400">💡 回答はいつでも変更できます。</p>
          </div>
        </section>

        {/* 日程調整 vs 参加確認 */}
        <section className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-slate-200 p-5 mb-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">■ 日程調整と参加確認の違い</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3">
              <p className="font-medium text-emerald-600 text-xs mb-2">📅 日程調整</p>
              <p className="text-xs text-slate-500">日程が<span className="font-bold">決まっていない</span>時</p>
              <p className="text-xs text-slate-500 mt-1">→ 候補日から選ぶ</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="font-medium text-blue-600 text-xs mb-2">✋ 参加確認</p>
              <p className="text-xs text-slate-500">日程が<span className="font-bold">決まった</span>後</p>
              <p className="text-xs text-slate-500 mt-1">→ 出欠を答える</p>
            </div>
          </div>
        </section>

        {/* 通知について */}
        <section id="notification" className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">■ 通知について</h2>
          <div className="space-y-3 text-sm text-slate-600">
            <p>グループに以下のタイミングで通知が届きます。</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">📅</span>
                <span>日程調整が始まった時</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">✋</span>
                <span>参加確認が始まった時</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">⏰</span>
                <span>締め切りが近づいた時（リマインド）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">🎉</span>
                <span>日程が確定した時</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500">💡</span>
                <span>人気の行きたいが出てきた時（おすすめ提案）</span>
              </li>
            </ul>
            <p className="text-xs text-slate-400">※ 設定画面で通知のON/OFFを変更できます</p>
          </div>
        </section>

        {/* 管理画面の開き方 */}
        <section id="open" className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">■ 管理画面の開き方</h2>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-xs">1</span>
              <div>
                <p className="font-medium">リッチメニューから</p>
                <p className="text-xs text-slate-400">トーク画面下部の「管理画面」をタップ</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-xs">2</span>
              <div>
                <p className="font-medium">「メニュー」と送信</p>
                <p className="text-xs text-slate-400">グループで「メニュー」とメッセージを送る</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-xs">3</span>
              <div>
                <p className="font-medium">通知のリンクから</p>
                <p className="text-xs text-slate-400">届いた通知の「回答する」をタップ</p>
              </div>
            </li>
          </ul>
        </section>

        {/* よくある質問 */}
        <section id="faq" className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">■ よくある質問</h2>
          <div className="space-y-4">
            <div>
              <p className="font-medium text-slate-900 text-sm">Q. グループが表示されません</p>
              <p className="text-xs text-slate-500 mt-1">A. グループトークから管理画面を開くか、グループで何かメッセージを送ってください。初めて開く時にグループが登録されます。</p>
            </div>
            <div>
              <p className="font-medium text-slate-900 text-sm">Q. 日程を確定できません</p>
              <p className="text-xs text-slate-500 mt-1">A. 「この日に確定」ボタンは作成者のみに表示されます。作成者に確定をお願いしてください。</p>
            </div>
            <div>
              <p className="font-medium text-slate-900 text-sm">Q. 投票を変更したい</p>
              <p className="text-xs text-slate-500 mt-1">A. 同じボタンをもう一度押すと取り消せます。別の回答を押せば変更できます。最後に「回答を保存」を押してください。</p>
            </div>
            <div>
              <p className="font-medium text-slate-900 text-sm">Q. 行きたいを削除したい</p>
              <p className="text-xs text-slate-500 mt-1">A. 作成者のみ削除できます。行きたいリストで右上のゴミ箱アイコンをタップしてください。日程調整・参加確認が始まると削除できなくなります。</p>
            </div>
            <div>
              <p className="font-medium text-slate-900 text-sm">Q. 通知が届きません</p>
              <p className="text-xs text-slate-500 mt-1">A. 設定画面で通知がONになっているか確認してください。また、LINEアプリの通知設定もご確認ください。</p>
            </div>
            <div>
              <p className="font-medium text-slate-900 text-sm">Q. 複数のグループで使いたい</p>
              <p className="text-xs text-slate-500 mt-1">A. 各グループにあそボットを招待してください。ホーム画面左上からグループを切り替えられます。</p>
            </div>
          </div>
        </section>

        {/* お問い合わせ */}
        <section className="bg-white rounded-xl border border-slate-200 p-5 mb-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">■ お問い合わせ・ご要望</h2>
          <div className="space-y-3">
            <a 
              href="https://docs.google.com/forms/d/e/1FAIpQLSeaPG1tmJtwvwZ1aaKb_kTGAL0KyKUYzZ79YZav6lj112zWKA/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-emerald-50 text-emerald-600 text-sm font-medium rounded-lg p-3 text-center hover:bg-emerald-100 transition"
            >
              📝 ご意見・ご要望フォーム
            </a>
            <p className="text-xs text-slate-400 text-center">
              または <a href="mailto:asobott.official@gmail.com" className="text-emerald-600 hover:underline">asobott.official@gmail.com</a> まで
            </p>
          </div>
        </section>

        {/* フッター */}
        <div className="text-center pt-4 pb-8">
          <p className="text-xs text-slate-300">あそボット v1.3.0</p>
        </div>
      </div>
    </div>
  );
}
