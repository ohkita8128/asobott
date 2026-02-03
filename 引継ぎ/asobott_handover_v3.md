# あそボット 引継ぎ資料 v3

**更新日**: 2026-02-04  
**バージョン**: v1.4.0

---

## 🎉 今回の完了項目

### 機能追加

| 機能 | 内容 | ファイル |
|------|------|---------|
| ソート機能 | 🔥人気順 / 🕐新しい順 | WishesContent.tsx |
| 4ヶ月オプション | 提案頻度に120日追加 | SettingsContent.tsx |
| デフォルト2週間 | 新規グループの提案頻度 | settings/route.ts |
| 作成者の行きたい自動ON | wish作成時に自動でinterest追加 | wishes/route.ts |
| Flex Message化 | 通知からOGP排除 | notification.ts |
| SWR最適化 | revalidateOnFocus: false等 | layout.tsx |

### キャラクター機能（メイン）

| 項目 | 内容 |
|------|------|
| あそじぃ 🎩 | 丁寧な敬語、執事キャラ |
| あそぺん 🐧 | ゆるい口調、ペンギンキャラ |
| 設定画面 | グループごとに切り替え可能 |
| sender対応 | メッセージごとにアイコン・名前変更 |
| 全メッセージ対応 | webhook.ts + notification.ts |

### DB変更（実行済み）

```sql
ALTER TABLE group_settings 
ADD COLUMN character_type TEXT DEFAULT 'butler';
```

---

## 📁 変更ファイル一覧

```
src/
├── app/
│   ├── api/
│   │   ├── groups/[groupId]/
│   │   │   ├── settings/route.ts  ← デフォルト2週間
│   │   │   └── wishes/route.ts    ← 作成者の行きたい自動ON
│   │   └── webhook/route.ts       ← キャラクター対応 + sender
│   └── liff/
│       ├── layout.tsx             ← SWR最適化
│       ├── settings/
│       │   └── SettingsContent.tsx ← キャラクター選択UI + 4ヶ月
│       └── wishes/
│           └── WishesContent.tsx  ← ソート機能
├── hooks/
│   └── use-wishes.ts              ← created_at型追加
└── lib/
    └── line/
        └── notification.ts        ← キャラクター対応 + Flex Message

public/
└── icons/
    ├── butler-icon.png            ← あそじぃアイコン
    └── penguin-icon.png           ← あそぺんアイコン
```

---

## 🐧 キャラクター設定詳細

### アイコンURL

```
https://asobott.vercel.app/icons/butler-icon.png   ← あそじぃ
https://asobott.vercel.app/icons/penguin-icon.png  ← あそぺん
```

### 設定画面UI

```
┌─────────────────────────────┐
│ 🎭 キャラクター              │
│ 通知メッセージの口調を選べます│
├─────────────────────────────┤
│  ┌─────┐    ┌─────┐        │
│  │ 🎩  │    │ 🐧  │        │
│  │あそじぃ│   │あそぺん│      │
│  │丁寧な │    │ゆるい │       │
│  │敬語  │    │口調  │        │
│  └─────┘    └─────┘        │
└─────────────────────────────┘
```

### デフォルト動作

| 場面 | キャラ |
|------|--------|
| 友達追加（1対1） | あそじぃ 🎩 |
| グループ参加（新規） | あそじぃ 🎩 |
| それ以降 | グループ設定に従う |

### コード構造

```typescript
// キャラクター設定
const characters = {
  butler: {
    name: 'あそじぃ',
    icon: '🎩',
    iconUrl: 'https://asobott.vercel.app/icons/butler-icon.png',
  },
  penguin: {
    name: 'あそぺん',
    icon: '🐧',
    iconUrl: 'https://asobott.vercel.app/icons/penguin-icon.png',
  },
};

// キャラクター取得
async function getCharacterType(groupId: string): Promise<CharacterType> {
  // group_settings から character_type を取得
  // なければ 'butler' を返す
}

// sender取得
function getSender(charType: CharacterType) {
  const char = characters[charType];
  return { name: char.name, iconUrl: char.iconUrl };
}
```

---

## 💬 メッセージ一覧

### 友達追加

| あそじぃ 🎩 | あそぺん 🐧 |
|------------|------------|
| あそじぃと申します 🎩<br><br>グループの「いつか行きたいね」を「この日に行こう！」に変えるお手伝いをいたします。<br><br>まずはグループへお招きください。 | あそぺんだよ 🐧<br><br>グループの「いつか行きたいね」を「この日に行こう！」にするよ！<br><br>グループに招待してね！ |

### グループ参加

| あそじぃ 🎩 | あそぺん 🐧 |
|------------|------------|
| お招きありがとうございます 🎩<br>あそじぃと申します。<br>皆様が集まる機会、もっと増やしましょう。 | グループに呼んでくれてありがとう！🐧<br>あそぺんだよ。<br>みんなで遊ぶ予定、もっと増やそう！ |

### メニュー

| あそじぃ 🎩 | あそぺん 🐧 |
|------------|------------|
| 🎩 あそじぃ<br>ご用命はこちらから。 | 🐧 あそぺん<br>なにかあったらここからね！ |

### 使い方

| あそじぃ 🎩 | あそぺん 🐧 |
|------------|------------|
| 🎩 あそじぃ<br>使い方をご案内いたします。 | 🐧 あそぺん<br>使い方を説明するね！ |

### 日程調整開始

| あそじぃ 🎩 | あそぺん 🐧 |
|------------|------------|
| 🎩 あそじぃ<br>「〇〇」<br>日程調整が始まりました<br>ご都合をお聞かせください。 | 🐧 あそぺん<br>「〇〇」<br>日程調整はじまったよ！<br>いつ空いてる？教えて！ |

### 参加確認開始

| あそじぃ 🎩 | あそぺん 🐧 |
|------------|------------|
| 🎩 あそじぃ<br>「〇〇」<br>参加確認が始まりました<br>ご都合をお聞かせください。 | 🐧 あそぺん<br>「〇〇」<br>参加確認だよ！<br>参加できるか教えて！ |

### リマインド

| あそじぃ 🎩 | あそぺん 🐧 |
|------------|------------|
| 🎩 あそじぃ<br>⏰ あと3日 / 明日が締め切り<br>「〇〇」の日程調整<br>まだの方はお早めにご回答を。 | 🐧 あそぺん<br>⏰ あと3日だよ〜 / 明日締め切りだよ！<br>「〇〇」の日程調整<br>まだの人は早めに回答してね！ |

### 日程確定

| あそじぃ 🎩 | あそぺん 🐧 |
|------------|------------|
| 🎩 あそじぃ より<br><br>📅「〇〇」の日程が決まりました。<br><br>2/15(土) 10:00〜<br><br>皆様のご参加、お待ちしております。 | 🐧 あそぺん<br><br>「〇〇」の日程決まったよ！🎉<br><br>📅 2/15(土) 10:00〜<br><br>みんな来てね！ |

### おすすめ提案（候補あり）- 3パターンからランダム

**パターン1**
| あそじぃ 🎩 | あそぺん 🐧 |
|------------|------------|
| ご報告がございます 🎩<br><br>人気の行きたい場所:<br>　・富士急（3人）<br><br>どなたか日程調整を始めてみては。<br>「いつか」が「この日」に変わります。 | みんな！ 🐧<br><br>人気の場所はこれ！<br>　・富士急（3人）<br><br>誰か日程調整はじめてみない？ |

**パターン2**
| あそじぃ 🎩 | あそぺん 🐧 |
|------------|------------|
| おや、盛り上がっているようですね 🎩<br><br>　・富士急（3人）<br><br>3件の「行きたい！」が集まっております。<br>そろそろ日程を決めてみませんか。 | 盛り上がってきたね！ 🐧<br><br>　・富士急（3人）<br><br>3件も「行きたい！」あるよ。<br>そろそろ決めちゃう？ |

**パターン3**
| あそじぃ 🎩 | あそぺん 🐧 |
|------------|------------|
| どなたか幹事役、いかがでしょう 🎩<br><br>　・富士急（3人）<br><br>誰かが声をあげれば、予定は動き出すもの。<br>わたくしがお手伝いいたします。 | 幹事さん募集！ 🐧<br><br>　・富士急（3人）<br><br>誰かが声かければ予定は動き出すよ！ |

### おすすめ提案（候補なし）- 3パターンからランダム

**パターン1**
| あそじぃ 🎩 | あそぺん 🐧 |
|------------|------------|
| 最近、集まっていますか？ 🎩<br><br>「行きたい場所」がまだ空でございます。<br><br>焼肉、カラオケ、映画、旅行...<br>思いついたら、ぜひ追加を。 | 最近みんな元気？ 🐧<br><br>「行きたい場所」がまだないよ！<br><br>焼肉、カラオケ、映画、旅行...<br>なんでも追加してね！ |

**パターン2**
| あそじぃ 🎩 | あそぺん 🐧 |
|------------|------------|
| ふと思い出した時がチャンスです 🎩<br><br>「いつか行きたいね」<br>そう思った場所、ありませんか。<br><br>リストに追加しておけば、忘れません。 | ふと思い出した時がチャンス！ 🐧<br><br>「いつか行きたいな」って場所ない？<br><br>追加しとけば忘れないよ！ |

**パターン3**
| あそじぃ 🎩 | あそぺん 🐧 |
|------------|------------|
| お元気ですか 🎩<br><br>行きたい場所リスト、お待ちしております。<br><br>小さな「行きたい」が、いつか予定になります。 | みんな元気してる？ 🐧<br><br>行きたい場所、待ってるよ！<br><br>小さな「行きたい」が予定になるかも！ |

---

## 📊 LINE API メッセージ課金

| API | 課金 | 用途 |
|-----|------|------|
| Reply API | ❌ 無料 | メニュー、使い方、グループ参加 |
| Push API | ✅ 課金対象 | 日程調整開始、リマインド、提案 |

**月200通まで無料** → 約14-20グループ運用可能

### 現在の使用状況（参考）
- Total: 113通
- Push: 10通（課金対象）
- Reply: 102通（無料）
- 残り: 190通

---

## 🔧 技術メモ

### sender パラメータ

```typescript
messages: [{
  type: 'text',
  text: 'メッセージ',
  sender: {
    name: 'あそぺん',
    iconUrl: 'https://asobott.vercel.app/icons/penguin-icon.png'
  }
}]
```

**注意点**:
- トーク内のメッセージ横のアイコン・名前 → **変わる**
- トーク一覧のアイコン → **変わらない**（LINE仕様）
- senderを使うにはiconUrlが必須

### SWR設定

```typescript
<SWRConfig 
  value={{
    revalidateOnFocus: false,    // タブ戻り時の再取得OFF
    dedupingInterval: 5000,      // 5秒間の重複リクエスト防止
    revalidateOnReconnect: false // 再接続時の再取得OFF
  }}
>
```

---

## 📝 今後のTODO

### 優先度高
- [ ] Qiita記事投稿（下書き完成済み）
- [ ] X投稿
- [ ] ユーザー獲得

### 検討中
- [ ] Discord版
- [ ] Reply API活用でPush削減
- [ ] 新キャラ追加？

---

## 🔗 重要URL

| 項目 | URL |
|------|-----|
| 本番 | https://asobott.vercel.app |
| LP | https://asobott.vercel.app/lp |
| LIFF | https://liff.line.me/{LIFF_ID} |

---

## 📄 過去のトランスクリプト

```
/mnt/transcripts/2026-02-02-21-56-12-asobott-performance-sorting-ogp.txt
/mnt/transcripts/2026-02-03-22-00-27-asobott-sorting-flex-qiita-promo.txt
```

---

## 🗄️ DBスキーマ（group_settings）

```sql
CREATE TABLE group_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  notify_schedule_start BOOLEAN DEFAULT true,
  notify_reminder BOOLEAN DEFAULT true,
  notify_confirmed BOOLEAN DEFAULT true,
  suggest_enabled BOOLEAN DEFAULT true,
  suggest_interval_days INTEGER DEFAULT 30,  -- APIでは14に変更
  suggest_min_interests INTEGER DEFAULT 2,
  character_type TEXT DEFAULT 'butler',      -- 今回追加
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(group_id)
);
```

---

## 🎯 現在のバージョン

**あそボット v1.4.0**

主な機能:
- 行きたい場所リスト管理
- 日程調整（候補日投票）
- 参加確認
- おすすめ提案（定期通知）
- キャラクター切り替え（あそじぃ/あそぺん）
- ソート機能（人気順/新しい順）

---

*このドキュメントは2026年2月4日時点の情報です*
