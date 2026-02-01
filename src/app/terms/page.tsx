import Link from 'next/link';

export const metadata = {
  title: '利用規約 - あそボット',
  description: 'あそボットの利用規約です。',
};

export default function TermsPage() {
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
        <h1 className="text-2xl font-bold text-slate-900 mb-8">利用規約</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 mb-8">
            この利用規約（以下「本規約」といいます）は、あそボット（以下「本サービス」といいます）の利用条件を定めるものです。ユーザーの皆様（以下「ユーザー」といいます）には、本規約に従って本サービスをご利用いただきます。
          </p>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">第1条（適用）</h2>
            <p className="text-slate-600">
              本規約は、ユーザーと本サービス運営者との間の本サービスの利用に関わる一切の関係に適用されるものとします。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">第2条（利用登録）</h2>
            <ol className="list-decimal pl-6 text-slate-600 space-y-2">
              <li>本サービスにおいては、登録希望者がLINEアプリを通じて本サービスを友だち追加することにより、利用登録が完了するものとします。</li>
              <li>本サービスは、利用登録の申請者に以下の事由があると判断した場合、利用登録を承認しないことがあります。
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>虚偽の事項を届け出た場合</li>
                  <li>本規約に違反したことがある者からの申請である場合</li>
                  <li>その他、本サービス運営者が利用登録を相当でないと判断した場合</li>
                </ul>
              </li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">第3条（禁止事項）</h2>
            <p className="text-slate-600 mb-4">ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
            <ol className="list-decimal pl-6 text-slate-600 space-y-2">
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>本サービスの運営を妨害するおそれのある行為</li>
              <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
              <li>不正アクセスをし、またはこれを試みる行為</li>
              <li>他のユーザーに成りすます行為</li>
              <li>本サービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為</li>
              <li>その他、本サービス運営者が不適切と判断する行為</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">第4条（本サービスの提供の停止等）</h2>
            <ol className="list-decimal pl-6 text-slate-600 space-y-2">
              <li>本サービス運営者は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
                  <li>地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合</li>
                  <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                  <li>その他、本サービス運営者が本サービスの提供が困難と判断した場合</li>
                </ul>
              </li>
              <li>本サービス運営者は、本サービスの提供の停止または中断により、ユーザーまたは第三者が被ったいかなる不利益または損害についても、一切の責任を負わないものとします。</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">第5条（利用制限および登録抹消）</h2>
            <ol className="list-decimal pl-6 text-slate-600 space-y-2">
              <li>本サービス運営者は、ユーザーが以下のいずれかに該当する場合には、事前の通知なく、ユーザーに対して本サービスの全部もしくは一部の利用を制限し、またはユーザーとしての登録を抹消することができるものとします。
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>本規約のいずれかの条項に違反した場合</li>
                  <li>その他、本サービス運営者が本サービスの利用を適当でないと判断した場合</li>
                </ul>
              </li>
              <li>本サービス運営者は、本条に基づき本サービス運営者が行った行為によりユーザーに生じた損害について、一切の責任を負いません。</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">第6条（保証の否認および免責事項）</h2>
            <ol className="list-decimal pl-6 text-slate-600 space-y-2">
              <li>本サービス運営者は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。</li>
              <li>本サービス運営者は、本サービスに起因してユーザーに生じたあらゆる損害について一切の責任を負いません。</li>
              <li>本サービス運営者は、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">第7条（サービス内容の変更等）</h2>
            <p className="text-slate-600">
              本サービス運営者は、ユーザーに通知することなく、本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">第8条（利用規約の変更）</h2>
            <p className="text-slate-600">
              本サービス運営者は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。なお、本規約の変更後、本サービスの利用を開始した場合には、当該ユーザーは変更後の規約に同意したものとみなします。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">第9条（個人情報の取扱い）</h2>
            <p className="text-slate-600">
              本サービスの利用によって取得する個人情報については、本サービスの「プライバシーポリシー」に従い適切に取り扱うものとします。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">第10条（準拠法・裁判管轄）</h2>
            <ol className="list-decimal pl-6 text-slate-600 space-y-2">
              <li>本規約の解釈にあたっては、日本法を準拠法とします。</li>
              <li>本サービスに関して紛争が生じた場合には、本サービス運営者の所在地を管轄する裁判所を専属的合意管轄とします。</li>
            </ol>
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
