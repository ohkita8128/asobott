import { supabase } from '@/lib/supabase/client';

const LINE_API_URL = 'https://api.line.me/v2/bot/message/push';

type NotificationType = 
  | 'schedule_start'
  | 'schedule_reminder'
  | 'schedule_result'
  | 'confirm_start'
  | 'confirm_reminder'
  | 'date_confirmed'
  | 'suggestion';

type CharacterType = 'butler' | 'penguin';

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

// メッセージテンプレート
const messages = {
  scheduleStart: {
    butler: {
      header: '🎩 あそじぃ',
      body: '日程調整が始まりました',
      footer: 'ご都合をお聞かせください。',
    },
    penguin: {
      header: '🐧 あそぺん',
      body: '日程調整はじまったよ！',
      footer: 'いつ空いてる？教えて！',
    },
  },
  confirmStart: {
    butler: {
      header: '🎩 あそじぃ',
      body: '参加確認が始まりました',
      footer: 'ご都合をお聞かせください。',
    },
    penguin: {
      header: '🐧 あそぺん',
      body: '参加確認だよ！',
      footer: '参加できるか教えて！',
    },
  },
  reminder: {
    butler: {
      footer: 'まだの方はお早めにご回答を。',
    },
    penguin: {
      footer: 'まだの人は早めに回答してね！',
    },
  },
  dateConfirmed: {
    butler: (title: string, dateStr: string) => `🎩 あそじぃ より

📅「${title}」の日程が決まりました。

${dateStr}

皆様のご参加、お待ちしております。`,
    penguin: (title: string, dateStr: string) => `🐧 あそぺん

「${title}」の日程決まったよ！🎉

📅 ${dateStr}

みんな来てね！`,
  },
  suggestionWithItems: {
    butler: [
      (list: string) => `ご報告がございます 🎩

人気の行きたい場所:
${list}

どなたか日程調整を始めてみては。
「いつか」が「この日」に変わります。`,
      (list: string, total: number) => `おや、盛り上がっているようですね 🎩

${list}

${total}件の「行きたい！」が集まっております。
そろそろ日程を決めてみませんか。`,
      (list: string) => `どなたか幹事役、いかがでしょう 🎩

${list}

誰かが声をあげれば、予定は動き出すもの。
わたくしがお手伝いいたします。`,
    ],
    penguin: [
      (list: string) => `みんな！ 🐧

人気の場所はこれ！
${list}

誰か日程調整はじめてみない？`,
      (list: string, total: number) => `盛り上がってきたね！ 🐧

${list}

${total}件も「行きたい！」あるよ。
そろそろ決めちゃう？`,
      (list: string) => `幹事さん募集！ 🐧

${list}

誰かが声かければ予定は動き出すよ！`,
    ],
  },
  suggestionEmpty: {
    butler: [
      `最近、集まっていますか？ 🎩

「行きたい場所」がまだ空でございます。

焼肉、カラオケ、映画、旅行...
思いついたら、ぜひ追加を。`,
      `ふと思い出した時がチャンスです 🎩

「いつか行きたいね」
そう思った場所、ありませんか。

リストに追加しておけば、忘れません。`,
      `お元気ですか 🎩

行きたい場所リスト、お待ちしております。

小さな「行きたい」が、いつか予定になります。`,
    ],
    penguin: [
      `最近みんな元気？ 🐧

「行きたい場所」がまだないよ！

焼肉、カラオケ、映画、旅行...
なんでも追加してね！`,
      `ふと思い出した時がチャンス！ 🐧

「いつか行きたいな」って場所ない？

追加しとけば忘れないよ！`,
      `みんな元気してる？ 🐧

行きたい場所、待ってるよ！

小さな「行きたい」が予定になるかも！`,
    ],
  },
};

interface SendNotificationParams {
  groupId: string;
  wishId?: string;
  type: NotificationType;
  message?: string;
  flexMessage?: {
    altText: string;
    contents: object;
  };
  sender?: {
    name: string;
    iconUrl: string;
  };
}

// グループのキャラクター設定を取得
async function getCharacterType(groupId: string): Promise<CharacterType> {
  const { data: settings } = await supabase
    .from('group_settings')
    .select('character_type')
    .eq('group_id', groupId)
    .single();
  
  return (settings?.character_type as CharacterType) || 'butler';
}

// キャラクターに応じたsenderを取得
function getSender(charType: CharacterType): { name: string; iconUrl: string } | undefined {
  const char = characters[charType];
  if (char.iconUrl) {
    return { name: char.name, iconUrl: char.iconUrl };
  }
  return undefined; // デフォルトアイコンを使用
}

// LINE メッセージペイロードを組み立てる（push/queue 共通）
function buildLineMessage(
  message: string | undefined,
  flexMessage: { altText: string; contents: object } | undefined,
  sender: { name: string; iconUrl: string } | undefined
): object {
  return flexMessage
    ? { type: 'flex', altText: flexMessage.altText, contents: flexMessage.contents, ...(sender && { sender }) }
    : { type: 'text', text: message, ...(sender && { sender }) };
}

// 設定で無効化されているかチェック
function isNotificationDisabled(type: NotificationType, settings: { notify_schedule_start?: boolean; notify_reminder?: boolean; notify_confirmed?: boolean; suggest_enabled?: boolean } | null): boolean {
  if (!settings) return false;
  if ((type === 'schedule_start' || type === 'confirm_start') && !settings.notify_schedule_start) return true;
  if ((type === 'schedule_reminder' || type === 'confirm_reminder') && !settings.notify_reminder) return true;
  if (type === 'date_confirmed' && !settings.notify_confirmed) return true;
  if (type === 'suggestion' && !settings.suggest_enabled) return true;
  return false;
}

// pending_notifications に通知を登録（次のグループ発言で reply に乗せる）
interface QueueParams extends SendNotificationParams {
  ttlMinutes?: number | null;  // この時間経過後にpush fallback。null = fallbackしない
  expireDays?: number;          // 配信されないままこの日数経過したら破棄
}

export async function queueNotification({
  groupId, wishId, type, message, flexMessage, sender,
  ttlMinutes = null, expireDays = 30
}: QueueParams): Promise<boolean> {
  try {
    // 設定チェック
    const { data: settings } = await supabase
      .from('group_settings')
      .select('notify_schedule_start, notify_reminder, notify_confirmed, suggest_enabled')
      .eq('group_id', groupId)
      .single();
    if (isNotificationDisabled(type, settings)) return false;

    // 重複チェック（既に配信済みなら queue しない）
    if (wishId) {
      const { data: existing } = await supabase
        .from('notification_logs')
        .select('id')
        .eq('group_id', groupId)
        .eq('wish_id', wishId)
        .eq('notification_type', type)
        .maybeSingle();
      if (existing) {
        console.log('Notification already delivered, skip queue:', type, wishId);
        return false;
      }
    }

    const payload = buildLineMessage(message, flexMessage, sender);
    const now = new Date();
    const ttl_at = ttlMinutes != null ? new Date(now.getTime() + ttlMinutes * 60 * 1000).toISOString() : null;
    const expire_at = new Date(now.getTime() + expireDays * 24 * 60 * 60 * 1000).toISOString();

    // suggestion は1グループ1件に絞る（既存pendingを上書き）
    if (type === 'suggestion') {
      await supabase
        .from('pending_notifications')
        .delete()
        .eq('group_id', groupId)
        .eq('notification_type', 'suggestion')
        .is('claimed_at', null);
    }

    const { error } = await supabase
      .from('pending_notifications')
      .insert({
        group_id: groupId,
        wish_id: wishId || null,
        notification_type: type,
        payload,
        ttl_at,
        expire_at,
      });

    if (error) {
      console.error('Error queueing notification:', error);
      return false;
    }

    console.log('Notification queued:', type, wishId || groupId);
    return true;
  } catch (error) {
    console.error('Error in queueNotification:', error);
    return false;
  }
}

// グループにLINE通知を送信
export async function sendGroupNotification({ groupId, wishId, type, message, flexMessage, sender }: SendNotificationParams): Promise<boolean> {
  try {
    // グループ設定を確認
    const { data: settings } = await supabase
      .from('group_settings')
      .select('*')
      .eq('group_id', groupId)
      .single();

    // 通知が無効な場合はスキップ
    if (settings) {
      if ((type === 'schedule_start' || type === 'confirm_start') && !settings.notify_schedule_start) return false;
      if ((type === 'schedule_reminder' || type === 'confirm_reminder') && !settings.notify_reminder) return false;
      if (type === 'date_confirmed' && !settings.notify_confirmed) return false;
      if (type === 'suggestion' && !settings.suggest_enabled) return false;
    }

    // 重複チェック（wishIdがある場合のみ）
    if (wishId) {
      const { data: existing } = await supabase
        .from('notification_logs')
        .select('id')
        .eq('group_id', groupId)
        .eq('wish_id', wishId)
        .eq('notification_type', type)
        .single();

      if (existing) {
        console.log('Notification already sent:', type, wishId);
        return false;
      }
    }

    // グループのLINE IDを取得
    const { data: group } = await supabase
      .from('groups')
      .select('line_group_id')
      .eq('id', groupId)
      .single();

    if (!group?.line_group_id) {
      console.error('No LINE group ID found');
      return false;
    }

    // LINE APIで送信
    const messagePayload = flexMessage 
      ? [{ type: 'flex', altText: flexMessage.altText, contents: flexMessage.contents, ...(sender && { sender }) }]
      : [{ type: 'text', text: message, ...(sender && { sender }) }];

    const response = await fetch(LINE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        to: group.line_group_id,
        messages: messagePayload
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('LINE API error:', error);
      return false;
    }

    // 通知ログを記録
    await supabase
      .from('notification_logs')
      .insert({
        group_id: groupId,
        wish_id: wishId || null,
        notification_type: type,
        delivery_method: 'push',
      });

    // グループのlast_activity_atを更新
    await supabase
      .from('groups')
      .update({ last_activity_at: new Date().toISOString() })
      .eq('id', groupId);

    return true;
  } catch (error) {
    console.error('Error sending notification:', error);
    return false;
  }
}

// 日程調整開始通知
export async function notifyScheduleStart(groupId: string, wishId: string, title: string, liffUrl: string) {
  const charType = await getCharacterType(groupId);
  const msg = messages.scheduleStart[charType];
  const sender = getSender(charType);
  
  return sendGroupNotification({
    groupId,
    wishId,
    type: 'schedule_start',
    sender,
    flexMessage: {
      altText: `「${title}」の日程調整が始まりました`,
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            { type: 'text', text: msg.header, size: 'sm', color: '#888888' },
            { type: 'text', text: `「${title}」`, weight: 'bold', size: 'lg', margin: 'md', wrap: true },
            { type: 'text', text: msg.body, size: 'md', margin: 'sm' },
            { type: 'text', text: msg.footer, size: 'sm', color: '#666666', margin: 'lg' },
          ],
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'button',
              style: 'primary',
              color: '#22c55e',
              action: { type: 'uri', label: '回答する', uri: liffUrl },
            },
          ],
        },
      },
    },
  });
}

// 参加確認開始通知
export async function notifyConfirmStart(groupId: string, wishId: string, title: string, dateStr: string, liffUrl: string) {
  const charType = await getCharacterType(groupId);
  const msg = messages.confirmStart[charType];
  const sender = getSender(charType);
  
  return sendGroupNotification({
    groupId,
    wishId,
    type: 'confirm_start',
    sender,
    flexMessage: {
      altText: `「${title}」の参加確認が始まりました`,
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            { type: 'text', text: msg.header, size: 'sm', color: '#888888' },
            { type: 'text', text: `「${title}」`, weight: 'bold', size: 'lg', margin: 'md', wrap: true },
            { type: 'text', text: msg.body, size: 'md', margin: 'sm' },
            { type: 'text', text: `📅 ${dateStr}`, size: 'sm', color: '#22c55e', margin: 'md' },
            { type: 'text', text: msg.footer, size: 'sm', color: '#666666', margin: 'lg' },
          ],
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'button',
              style: 'primary',
              color: '#22c55e',
              action: { type: 'uri', label: '回答する', uri: liffUrl },
            },
          ],
        },
      },
    },
  });
}

// 締め切りリマインド通知
export async function notifyReminder(groupId: string, wishId: string, title: string, daysLeft: number, type: 'schedule' | 'confirm', liffUrl: string) {
  const charType = await getCharacterType(groupId);
  const typeLabel = type === 'schedule' ? '日程調整' : '参加確認';
  const urgency = daysLeft === 1 
    ? (charType === 'butler' ? '明日が締め切り' : '明日締め切りだよ！')
    : (charType === 'butler' ? `あと${daysLeft}日` : `あと${daysLeft}日だよ〜`);
  const msg = messages.reminder[charType];
  const header = charType === 'butler' ? '🎩 あそじぃ' : '🐧 あそぺん';
  const sender = getSender(charType);
  
  return sendGroupNotification({
    groupId,
    wishId,
    type: type === 'schedule' ? 'schedule_reminder' : 'confirm_reminder',
    sender,
    flexMessage: {
      altText: `「${title}」の${typeLabel}、${urgency}`,
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            { type: 'text', text: header, size: 'sm', color: '#888888' },
            { type: 'text', text: `⏰ ${urgency}`, weight: 'bold', size: 'lg', margin: 'md', color: '#f97316' },
            { type: 'text', text: `「${title}」の${typeLabel}`, size: 'md', margin: 'sm', wrap: true },
            { type: 'text', text: msg.footer, size: 'sm', color: '#666666', margin: 'lg' },
          ],
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'button',
              style: 'primary',
              color: '#22c55e',
              action: { type: 'uri', label: '回答する', uri: liffUrl },
            },
          ],
        },
      },
    },
  });
}

// 日程確定通知
export async function notifyDateConfirmed(groupId: string, wishId: string, title: string, dateStr: string) {
  const charType = await getCharacterType(groupId);
  const message = messages.dateConfirmed[charType](title, dateStr);
  const sender = getSender(charType);

  return sendGroupNotification({
    groupId,
    wishId,
    type: 'date_confirmed',
    message,
    sender
  });
}

// 定期ダイジェスト通知
interface DigestParams {
  popularWishes: { title: string; interestCount: number }[];
  waitingWishes: string[];
  schedulingWishes: string[];
  confirmingWishes: string[];
  liffUrl: string;
}

export async function notifyDigest(groupId: string, params: DigestParams) {
  const { popularWishes, waitingWishes, schedulingWishes, confirmingWishes, liffUrl } = params;
  const charType = await getCharacterType(groupId);
  const sender = getSender(charType);
  const hasContent = popularWishes.length > 0 || waitingWishes.length > 0 || schedulingWishes.length > 0 || confirmingWishes.length > 0;

  // 何もない場合は空メッセージ
  if (!hasContent) {
    const patterns = messages.suggestionEmpty[charType];
    const message = patterns[Math.floor(Math.random() * patterns.length)];

    return queueNotification({
      groupId,
      type: 'suggestion',
      sender,
      flexMessage: {
        altText: message,
        contents: {
          type: 'bubble',
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              { type: 'text', text: message, size: 'sm', wrap: true },
            ],
          },
          footer: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'button',
                style: 'primary',
                color: '#22c55e',
                action: { type: 'uri', label: '行きたい場所を追加する', uri: liffUrl },
              },
            ],
          },
        },
      },
    });
  }

  // ダイジェスト Flex Message を構築
  const header = charType === 'butler' ? '🎩 あそじぃ' : '🐧 あそぺん';
  const bodyContents: object[] = [
    { type: 'text', text: header, size: 'sm', color: '#888888' },
    { type: 'text', text: 'みんなの行きたいリスト', weight: 'bold', size: 'lg', margin: 'md' },
  ];

  // 日程調整中セクション
  if (schedulingWishes.length > 0) {
    bodyContents.push(
      { type: 'separator', margin: 'lg' },
      { type: 'text', text: '📅 日程調整中', weight: 'bold', size: 'sm', margin: 'lg', color: '#f97316' },
    );
    for (const title of schedulingWishes) {
      bodyContents.push(
        { type: 'text', text: `　・${title}`, size: 'sm', margin: 'sm', wrap: true },
      );
    }
    const nudge = charType === 'butler' ? 'まだの方はご回答を。' : 'まだの人は回答してね！';
    bodyContents.push(
      { type: 'text', text: nudge, size: 'xs', color: '#999999', margin: 'sm' },
    );
  }

  // 参加投票中セクション
  if (confirmingWishes.length > 0) {
    bodyContents.push(
      { type: 'separator', margin: 'lg' },
      { type: 'text', text: '🗳 参加投票中', weight: 'bold', size: 'sm', margin: 'lg', color: '#8b5cf6' },
    );
    for (const title of confirmingWishes) {
      bodyContents.push(
        { type: 'text', text: `　・${title}`, size: 'sm', margin: 'sm', wrap: true },
      );
    }
    const nudge = charType === 'butler' ? '参加可否をお聞かせください。' : '参加できるか教えて！';
    bodyContents.push(
      { type: 'text', text: nudge, size: 'xs', color: '#999999', margin: 'sm' },
    );
  }

  // 人気の候補セクション
  if (popularWishes.length > 0) {
    bodyContents.push(
      { type: 'separator', margin: 'lg' },
      { type: 'text', text: '🔥 人気の候補', weight: 'bold', size: 'sm', margin: 'lg', color: '#22c55e' },
    );
    for (const w of popularWishes) {
      bodyContents.push(
        { type: 'text', text: `　・${w.title}（${w.interestCount}人）`, size: 'sm', margin: 'sm', wrap: true },
      );
    }
    const nudge = charType === 'butler' ? '日程調整を始めてみては。' : '日程調整はじめてみない？';
    bodyContents.push(
      { type: 'text', text: nudge, size: 'xs', color: '#999999', margin: 'sm' },
    );
  }

  // 反応待ちセクション
  if (waitingWishes.length > 0) {
    bodyContents.push(
      { type: 'separator', margin: 'lg' },
      { type: 'text', text: '💬 反応待ち', weight: 'bold', size: 'sm', margin: 'lg', color: '#64748b' },
    );
    for (const title of waitingWishes) {
      bodyContents.push(
        { type: 'text', text: `　・${title}`, size: 'sm', margin: 'sm', wrap: true },
      );
    }
    const nudge = charType === 'butler' ? '気になる方は「行きたい！」を。' : '気になったら「行きたい！」押してね！';
    bodyContents.push(
      { type: 'text', text: nudge, size: 'xs', color: '#999999', margin: 'sm' },
    );
  }

  const altParts: string[] = [];
  if (schedulingWishes.length > 0) altParts.push(`日程調整中${schedulingWishes.length}件`);
  if (confirmingWishes.length > 0) altParts.push(`参加投票中${confirmingWishes.length}件`);
  if (popularWishes.length > 0) altParts.push(`人気の候補${popularWishes.length}件`);
  if (waitingWishes.length > 0) altParts.push(`反応待ち${waitingWishes.length}件`);
  const altText = `みんなの行きたいリスト：${altParts.join('、')}`;

  return queueNotification({
    groupId,
    type: 'suggestion',
    sender,
    flexMessage: {
      altText,
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: bodyContents,
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'button',
              style: 'primary',
              color: '#22c55e',
              action: { type: 'uri', label: 'リストを見る', uri: liffUrl },
            },
          ],
        },
      },
    },
  });
}
