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

interface SendNotificationParams {
  groupId: string;
  wishId?: string;
  type: NotificationType;
  message?: string;
  flexMessage?: {
    altText: string;
    contents: object;
  };
}

// グループにLINE通知を送信
export async function sendGroupNotification({ groupId, wishId, type, message, flexMessage }: SendNotificationParams): Promise<boolean> {
  try {
    // グループ設定を確認
    const { data: settings } = await supabase
      .from('group_settings')
      .select('*')
      .eq('group_id', groupId)
      .single();

    // 通知が無効な場合はスキップ
    if (settings) {
      // 開始通知（日程調整 or 参加確認）
      if ((type === 'schedule_start' || type === 'confirm_start') && !settings.notify_schedule_start) return false;
      // リマインド
      if ((type === 'schedule_reminder' || type === 'confirm_reminder') && !settings.notify_reminder) return false;
      // 確定通知
      if (type === 'date_confirmed' && !settings.notify_confirmed) return false;
      // おすすめ提案
      if (type === 'suggestion' && !settings.suggest_enabled) return false;
    }

    // 重複チェック
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
    const messages = flexMessage 
      ? [{ type: 'flex', altText: flexMessage.altText, contents: flexMessage.contents }]
      : [{ type: 'text', text: message }];

    const response = await fetch(LINE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        to: group.line_group_id,
        messages
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('LINE API error:', error);
      return false;
    }

    // 通知ログを記録
    if (wishId) {
      await supabase
        .from('notification_logs')
        .insert({
          group_id: groupId,
          wish_id: wishId,
          notification_type: type
        });
    }

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
  return sendGroupNotification({
    groupId,
    wishId,
    type: 'schedule_start',
    flexMessage: {
      altText: `「${title}」の日程調整が始まりました`,
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            { type: 'text', text: '🎩 あそボット', size: 'sm', color: '#888888' },
            { type: 'text', text: `「${title}」`, weight: 'bold', size: 'lg', margin: 'md', wrap: true },
            { type: 'text', text: '日程調整が始まりました', size: 'md', margin: 'sm' },
            { type: 'text', text: 'ご都合をお聞かせください。', size: 'sm', color: '#666666', margin: 'lg' },
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
  return sendGroupNotification({
    groupId,
    wishId,
    type: 'confirm_start',
    flexMessage: {
      altText: `「${title}」の参加確認が始まりました`,
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            { type: 'text', text: '🎩 あそボット', size: 'sm', color: '#888888' },
            { type: 'text', text: `「${title}」`, weight: 'bold', size: 'lg', margin: 'md', wrap: true },
            { type: 'text', text: '参加確認が始まりました', size: 'md', margin: 'sm' },
            { type: 'text', text: `📅 ${dateStr}`, size: 'sm', color: '#22c55e', margin: 'md' },
            { type: 'text', text: 'ご都合をお聞かせください。', size: 'sm', color: '#666666', margin: 'lg' },
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
  const typeLabel = type === 'schedule' ? '日程調整' : '参加確認';
  const urgency = daysLeft === 1 ? '明日が締め切り' : `あと${daysLeft}日`;
  
  return sendGroupNotification({
    groupId,
    wishId,
    type: type === 'schedule' ? 'schedule_reminder' : 'confirm_reminder',
    flexMessage: {
      altText: `「${title}」の${typeLabel}、${urgency}です`,
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            { type: 'text', text: '🎩 あそボット', size: 'sm', color: '#888888' },
            { type: 'text', text: `⏰ ${urgency}`, weight: 'bold', size: 'lg', margin: 'md', color: '#f97316' },
            { type: 'text', text: `「${title}」の${typeLabel}`, size: 'md', margin: 'sm', wrap: true },
            { type: 'text', text: 'まだの方はお早めにご回答を。', size: 'sm', color: '#666666', margin: 'lg' },
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
  const message = `🎩 あそボット より

📅「${title}」の日程が決まりました。

${dateStr}

皆様のご参加、お待ちしております。`;

  return sendGroupNotification({
    groupId,
    wishId,
    type: 'date_confirmed',
    message
  });
}

// おすすめ提案通知（候補あり）
export async function notifySuggestion(groupId: string, suggestions: { title: string; interestCount: number }[], liffUrl: string) {
  const list = suggestions.map(s => `　・${s.title}（${s.interestCount}人）`).join('\n');
  const total = suggestions.reduce((sum, s) => sum + s.interestCount, 0);
  
  const patterns = [
`ご報告がございます 🎩

人気の行きたい場所:
${list}

どなたか日程調整を始めてみては。
「いつか」が「この日」に変わります。`,

`おや、盛り上がっているようですね 🎩

${list}

${total}件の「行きたい！」が集まっております。
そろそろ日程を決めてみませんか。`,

`どなたか幹事役、いかがでしょう 🎩

${list}

誰かが声をあげれば、予定は動き出すもの。
わたくしがお手伝いいたします。`,
  ];

  const message = patterns[Math.floor(Math.random() * patterns.length)];

  return sendGroupNotification({
    groupId,
    type: 'suggestion',
    message
  });
}

// おすすめ提案通知（候補なし）
export async function notifySuggestionEmpty(groupId: string, liffUrl: string) {
  const patterns = [
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
  ];

  const message = patterns[Math.floor(Math.random() * patterns.length)];

  return sendGroupNotification({
    groupId,
    type: 'suggestion',
    message
  });
}
