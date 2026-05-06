# asobott

LINE Bot + LIFF 管理画面で、友達グループの「いつか行きたいね」を「この日に行こう」に変える計画支援サービス。  
旧名 NextHang。

---

## 技術スタック

- **フロント / API**: Next.js 16 (App Router) + TypeScript + Tailwind v4
- **UI**: React 19 + SWR
- **DB**: Supabase (Postgres) — service role key でサーバ側から直接アクセス
- **LINE 連携**: `@line/bot-sdk` (Messaging API), `@line/liff` (LIFF SDK)
- **ホスティング**: Vercel
- **本番 LIFF**: https://liff.line.me/2009015521-LvLwajYC

### ビルド・テスト
- `npm run dev` — ローカル
- `npm run build` — **本番相当ビルド。フロント変更時は必ず通すこと**（`tsc --noEmit` だけでは Next.js の静的プリレンダリングエラーが検出できない）
- `npm run lint` — eslint。既存の React hooks 警告がいくつか残っているがそれは無視

---

## ディレクトリ構成（要点）

```
src/
├── app/
│   ├── api/
│   │   ├── webhook/route.ts         ← LINE webhook（最重要）
│   │   ├── cron/route.ts            ← Vercel Cron 受け口（毎日17時 JST）
│   │   ├── wishes/[wishId]/         ← wish CRUD と関連エンドポイント
│   │   ├── groups/[groupId]/        ← グループ別データ
│   │   └── ...
│   ├── liff/                        ← LIFF 内のページ群
│   │   ├── layout.tsx               ← GroupHeader を全ページ最上部に配置
│   │   ├── components/GroupHeader.tsx ← グループ切替バー（sticky）
│   │   ├── LiffContent.tsx          ← ホーム
│   │   ├── wishes/                  ← 行きたい関連
│   │   ├── calendar/, settings/, howto/, groups/
│   └── lp/, privacy/, terms/        ← LP・規約
├── lib/
│   ├── supabase/client.ts           ← service role で初期化された Supabase
│   ├── line/client.ts               ← LINE Messaging API クライアント
│   ├── line/notification.ts         ← 通知ロジック全般（後述：要重要理解）
│   └── auth.ts                      ← LIFF 経由 API の LINE token 検証
└── hooks/
    ├── use-liff.ts, use-group.ts, use-wishes.ts, use-members.ts, use-schedule.ts
```

---

## 通知システム（**最重要・特殊設計**）

LINE のメッセージ料金体系：
- **reply（webhook応答）**: 無料・回数無制限
- **push（能動送信）**: 月200通の無料枠を超えたら有料。**グループ送信はメンバー数倍カウント**（5人グループなら1送信=5カウント）

このコストを抑えるため、**「pending_notifications に積んで、誰かの発言時に reply に乗せて配信」** という遅延配信システムを構築。

### 配信の流れ

```
[トリガー] → queueNotification → pending_notifications に INSERT
                                           ↓
                   ┌───────────────────────┴───────────────────────┐
                   │                                                │
            [グループで発言]                                  [TTL経過]
                   ↓                                                ↓
            webhook が claim                              cron が claim
                   ↓                                                ↓
            replyMessage（無料）                          LINE Push API（課金）
                   ↓                                                ↓
            log(method=reply) + 削除                      log(method=push) + 削除
```

### 通知種別と挙動

| 通知名 | トリガー | TTL | expire_at | 即push切替条件 |
|---|---|---|---|---|
| `schedule_start` | 候補日作成 | 24h | 30日後 | - |
| `confirm_start` | votingStarted=true | 24h | 30日後 | - |
| `date_confirmed` | 日程確定 | 24h | 30日後 | - |
| `schedule_reminder` | 締切3日前 (cron) | 24h | **vote_deadline** | expire<ttl |
| `confirm_reminder` | 締切前日 (cron) | 24h | **vote_deadline** | expire<ttl |
| `suggestion` | 定期digest (cron) | null（fallbackなし） | 30日後 | - |

#### 重要な動的判定（`queueNotification` 内）
- `expire_at` が `ttl_at` より早い場合 → **queue せず即 push に切替**（reply試行のチャンスがそもそもないため）
- これにより confirm_reminder で deadline が cron 周回より前のケースを救済している

### 配信されない応答（reply・無料）
webhook 内で完結する応答は全て無料：
- 友達追加 / グループ参加挨拶
- メニュー応答（「メニュー」「あそボット」等の完全一致 or @メンション）
- 使い方応答
- 個人トークデフォ応答
- 「〜行きたい / 行ってみたい」検出時のチラ見反応（1時間クールダウン + 50%確率）

### 設定 (group_settings)
| カラム | 影響 | デフォルト |
|---|---|---|
| `notify_schedule_start` | schedule_start, confirm_start | true |
| `notify_reminder` | schedule_reminder, confirm_reminder | true |
| `notify_confirmed` | date_confirmed | true |
| `suggest_enabled` | suggestion | true |
| `suggest_interval_days` | suggestion 間隔 | **60日**（旧14日から変更済み） |
| `character_type` | 'butler' / 'penguin' | 'butler' |

---

## DB スキーマ（要点）

主要テーブル：
- `users` — LINE ユーザー
- `groups` — LINE グループ。`last_chime_at` でチラ見クールダウン管理、`last_activity_at` で活動度追跡
- `group_members` — グループ所属
- `group_settings` — 通知 ON/OFF・キャラ・suggest_interval_days など
- `wishes` — 行きたい場所。status: `open` → `voting` → `confirmed`、`voting_started` で参加確認フェーズ判定
- `interests` — wish に対する「行きたい！」表明
- `wish_responses` — 参加確認の回答（ok / maybe / ng）
- `schedule_candidates` + `schedule_votes` — 日程調整の候補日と投票
- `notification_logs` — 配信完了ログ（`delivery_method`: 'push' or 'reply'）
- `pending_notifications` — **配信待ちキュー**（`claimed_at` で並列処理ロック、`ttl_at` / `expire_at` を保持）

### Supabase RPC
- `claim_pending_notifications(p_group_id, p_limit)` — `FOR UPDATE SKIP LOCKED` で安全に claim

### RLS
- ほとんどのテーブルは **RLS 無効**（service role 経由なのでバイパス）
- `pending_notifications` は **RLS 有効化済み**（ポリシー無し = anon/authenticated アクセス全拒否）

---

## デプロイ・インフラ

- **Vercel Cron**: `0 8 * * *`（UTC 8時 = JST 17時、1日1回）
  - Vercel ダッシュボードの表示は UTC なので `08:00 AM` と出るが日本時間17時で正しい
  - Hobby プランは1日1回までの制約あり（より頻繁なcron が必要なら設計再考要）
- **環境変数**:
  - `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
  - `LINE_CHANNEL_ACCESS_TOKEN`, `NEXT_PUBLIC_LIFF_ID`
  - `CRON_SECRET`（Vercel Cron からの認可）
  - `LINE_BOT_FRIEND_URL`（任意・友達登録URL）

### 本番ドメイン
- 旧: `nexthang.vercel.app`
- 移行先: `asobott.vercel.app`（移行予定）

---

## 開発時の重要な注意

### 1. SQL マイグレーションは手動運用
- マイグレーション管理ツールは無し。Supabase の SQL エディタで直接実行
- 破壊的操作（DROP）は事前確認、特に運用中のテーブルは要注意
- 警告：`Query has destructive operations` は通常通り実行可だが文意確認すること
- マークダウンの見出しを SQL エディタにコピペすると syntax error → コードブロック内のSQLだけ抽出する

### 2. フロント変更時は必ず `npm run build` を通す
- `tsc --noEmit` では Next.js の静的プリレンダリング時の `useSearchParams` Suspense エラーが検出できない
- LIFF はLINE環境でしか動かないので**ブラウザでの動作確認は不可**。実機（LINE）での確認をユーザーに依頼すること

### 3. 通知量・コストへの配慮
- 軽い気持ちで `sendGroupNotification` を呼ばない。原則 `queueNotification` 経由
- 大きいグループへの push は1発でメンバー数分カウントが消費される
- メトリクス確認SQL：
  ```sql
  SELECT delivery_method, notification_type, COUNT(*)
  FROM notification_logs
  WHERE sent_at >= date_trunc('month', NOW())
  GROUP BY delivery_method, notification_type;
  ```

### 4. webhook の reply token は30秒で失効・1回限り
- handleMessage を変更する時は処理時間に注意（LINE API 呼び出し + DB 操作の合計）
- reply token を使った後の重複 reply は不可
- 失敗時の挙動は `4xx → 配信済み扱い`、`5xx/network → claimed_at リセットして retry` の設計

### 5. `useGroup` は複数コンポーネントから呼ぶと `register-user` API が複数回叩かれる
- `register-user` は idempotent (upsert) なので問題ないが、無駄
- GroupHeader（layout.tsx）+ 各ページ で2回叩かれる現状

### 6. リマインドは `vote_deadline` が cron 周回より前にあると配信できない可能性
- `queueNotification` の動的判定（expire<ttl で即push切替）でカバー済み
- ただし「沈黙グループ × deadline近接」 だと届かないままになる可能性は残る

### 7. グループ切替時の URL 遷移
- GroupHeader の switchGroup は **現在のページに留まる**設計
- ただし wish 詳細ページ（`/liff/wishes/[wishId]/(confirm|edit|schedule)`）は別グループに存在しないので **ホームへ遷移**
- 新しい dynamic な wish 配下のルートを追加する時は `GroupHeader.tsx` の正規表現を更新すること

---

## 過去にあったハマり / 学び

### LIFF + Suspense
- Next.js 静的プリレンダリングで `useSearchParams()` を含むコンポーネントは Suspense でラップ必須
- `GroupHeader` を `liff/layout.tsx` 直置きしてビルドエラーが出た過去あり → `<Suspense fallback={null}>` でラップ済み

### Vercel Cron の頻度
- Hobby プランは1日1回まで。当初これを知らずに「TTL 6h で fallback」など短い TTL を考えて意味なかった
- 現在は全部 24h TTL で揃えている（cron周期と一致）

### LINE グループ送信のメンバー数倍カウント
- 月初に 192/200 通使ってしまった経緯あり
- 提案ダイジェストの間隔を 14日 → 60日 に拡大、suggestion を queue 化することで対応
- 大規模グループへの送信は十分注意

### `@メンション` の検出
- `event.message.mention.mentionees` を使う
- 地の文の「あそボット」では誤反応しないよう、メンションテキストの厳密判定が必要
- ボット名は `あそぼっと` / `あそボット` / `あそぼーと` の3バリエーション

### `.single()` vs `.maybeSingle()`
- レコードがないかもしれない場面では `maybeSingle()` を使う
- `single()` は0件で error を返すので、ログがノイズで埋まる

---

## 設計図 / 引継ぎ資料の場所

`引継ぎ/` フォルダに歴代の設計書・ハンドオーバー資料あり。最新は `asobott_handover_v3.md`（2026-01-31時点）。  
ただしそれ以降にも変更が入っているので、**最新状態は git log とコードで確認すること**。

---

## キャラクター
- **あそじぃ（butler）**: 執事キャラ、敬語、🎩
- **あそぺん（penguin）**: ペンギンキャラ、カジュアル、🐧

通知文面・チラ見反応はキャラ別に分岐している。新規グループのデフォルトは butler。
