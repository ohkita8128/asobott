import { NextRequest, NextResponse } from 'next/server';
import { WebhookEvent } from '@line/bot-sdk';
import { lineClient } from '@/lib/line/client';
import { supabase } from '@/lib/supabase/client';

type CharacterType = 'butler' | 'penguin';

// キャラクター設定
const characters = {
  butler: {
    name: 'あそじぃ',
    iconUrl: 'https://asobott.vercel.app/icons/butler-icon.png',
  },
  penguin: {
    name: 'あそぺん',
    iconUrl: 'https://asobott.vercel.app/icons/penguin-icon.png',
  },
};

// メッセージテンプレート
const messageTemplates = {
  follow: {
    butler: `あそじぃと申します 🎩

グループの「いつか行きたいね」を「この日に行こう！」に変えるお手伝いをいたします。

まずはグループへお招きください。`,
    penguin: `あそぺんだよ 🐧

グループの「いつか行きたいね」を「この日に行こう！」にするよ！

グループに招待してね！`,
  },
  join: {
    butler: {
      title: '🎩 お招きありがとうございます',
      intro: 'あそじぃと申します。\nグループの「行きたい」を「行こう！」に変えるお手伝いをいたします。',
      flowTitle: '■ 使い方の流れ',
      flow: '① 管理画面から行きたい場所を追加\n② みんなで「行きたい！」を表明\n③ 日程調整 → 確定 → 参加確認',
      cta: 'まずは下のボタンから管理画面を開き、行きたい場所を追加してみてくださいませ。',
      accessHint: '💬 あとから「メニュー」と送るか、友達登録していただくと管理画面を再表示できます',
      helpHint: '📖「使い方」と送れば使い方ガイドをご案内いたします',
      deleteWarning: '⚠ 退会させますとこのグループのデータは削除されます',
    },
    penguin: {
      title: '🐧 呼んでくれてありがとう！',
      intro: 'あそぺんだよ！\nみんなの「行きたい」を「行こう！」に変えるよ！',
      flowTitle: '■ 使い方の流れ',
      flow: '① 管理画面から行きたい場所を追加\n② みんなで「行きたい！」を表明\n③ 日程調整 → 確定 → 参加確認',
      cta: 'まずは下のボタンから管理画面を開いて、行きたい場所を追加してみてね！',
      accessHint: '💬 あとから「メニュー」って送るか、友達登録すると管理画面を再表示できるよ',
      helpHint: '📖「使い方」って送れば使い方ガイドが見れるよ',
      deleteWarning: '⚠ 退会させるとこのグループのデータは消えちゃうよ',
    },
  },
  menu: {
    butler: {
      title: '🎩 あそじぃ',
      subtitle: 'ご用命はこちらから。',
    },
    penguin: {
      title: '🐧 あそぺん',
      subtitle: 'なにかあったらここからね！',
    },
  },
  howto: {
    butler: {
      title: '🎩 あそじぃ',
      subtitle: '使い方をご案内いたします。',
    },
    penguin: {
      title: '🐧 あそぺん',
      subtitle: '使い方を説明するね！',
    },
  },
};

// グループのキャラクター設定を取得
async function getCharacterType(lineGroupId: string): Promise<CharacterType> {
  const { data: group } = await supabase
    .from('groups')
    .select('id')
    .eq('line_group_id', lineGroupId)
    .single();
  
  if (!group) return 'butler';

  const { data: settings } = await supabase
    .from('group_settings')
    .select('character_type')
    .eq('group_id', group.id)
    .single();
  
  return (settings?.character_type as CharacterType) || 'butler';
}

// senderを取得
function getSender(charType: CharacterType) {
  const char = characters[charType];
  if (char.iconUrl) {
    return { name: char.name, iconUrl: char.iconUrl };
  }
  return undefined;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const events: WebhookEvent[] = body.events;

    for (const event of events) {
      await handleEvent(event);
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function handleEvent(event: WebhookEvent) {
  console.log('Event received:', event.type);

  switch (event.type) {
    case 'follow':
      await handleFollow(event);
      break;
    case 'join':
      await handleJoin(event);
      break;
    case 'memberJoined':
      await handleMemberJoined(event);
      break;
    case 'leave':
      await handleLeave(event);
      break;
    case 'memberLeft':
      await handleMemberLeft(event);
      break;
    case 'message':
      await handleMessage(event);
      break;
    default:
      console.log('Unhandled event type:', event.type);
  }
}

// 友達追加時（グループ外なのでデフォルトで返答）
async function handleFollow(event: WebhookEvent & { type: 'follow' }) {
  const userId = event.source.userId;
  if (!userId) return;

  try {
    const profile = await lineClient.getProfile(userId);

    const { error } = await supabase
      .from('users')
      .upsert({
        line_user_id: userId,
        display_name: profile.displayName,
        picture_url: profile.pictureUrl,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'line_user_id',
      });

    if (error) {
      console.error('Error saving user:', error);
    } else {
      console.log('User saved:', profile.displayName);
    }

    // 友達追加はグループ外なので、デフォルトの執事で返答
    const charType: CharacterType = 'butler';
    const sender = getSender(charType);
    const msg = messageTemplates.follow[charType];

    await lineClient.replyMessage({
      replyToken: event.replyToken,
      messages: [{
        type: 'text',
        text: msg,
        ...(sender && { sender }),
      }],
    });
  } catch (error) {
    console.error('Error in handleFollow:', error);
  }
}

// グループ参加時
async function handleJoin(event: WebhookEvent & { type: 'join' }) {
  const source = event.source;
  if (source.type !== 'group') return;

  const lineGroupId = source.groupId;
  const baseLiffUrl = `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}`;
  const botFriendUrl = process.env.LINE_BOT_FRIEND_URL || 'https://line.me/R/ti/p/@asobott';

  try {
    // グループ名を取得
    let groupName = null;
    try {
      const groupSummary = await lineClient.getGroupSummary(lineGroupId!);
      groupName = groupSummary.groupName;
    } catch (e) {
      console.log('Could not get group name:', e);
    }

    const { data: groupData, error } = await supabase
      .from('groups')
      .upsert({
        line_group_id: lineGroupId,
        name: groupName,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'line_group_id',
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving group:', error);
    } else {
      console.log('Group saved:', groupName || lineGroupId);
    }

    // DBのグループIDを使ってLIFF URLを生成
    const liffUrl = groupData?.id 
      ? `${baseLiffUrl}?groupId=${groupData.id}` 
      : baseLiffUrl;

    // キャラクター取得（新規グループはまだ設定がないのでデフォルト）
    const charType = await getCharacterType(lineGroupId!);
    const sender = getSender(charType);
    const msg = messageTemplates.join[charType];

    await lineClient.replyMessage({
      replyToken: event.replyToken,
      messages: [{
        type: 'flex',
        altText: 'あそボットが参加しました',
        ...(sender && { sender }),
        contents: {
          type: 'bubble',
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: msg.title,
                weight: 'bold',
                size: 'md',
              },
              {
                type: 'text',
                text: msg.intro,
                size: 'sm',
                color: '#666666',
                margin: 'md',
                wrap: true,
              },
              {
                type: 'separator',
                margin: 'lg',
              },
              {
                type: 'text',
                text: msg.flowTitle,
                weight: 'bold',
                size: 'sm',
                margin: 'lg',
              },
              {
                type: 'text',
                text: msg.flow,
                size: 'sm',
                color: '#444444',
                margin: 'sm',
                wrap: true,
              },
              {
                type: 'separator',
                margin: 'lg',
              },
              {
                type: 'text',
                text: msg.cta,
                size: 'sm',
                color: '#666666',
                margin: 'lg',
                wrap: true,
              },
              {
                type: 'text',
                text: msg.accessHint,
                size: 'xs',
                color: '#666666',
                margin: 'md',
                wrap: true,
              },
              {
                type: 'text',
                text: msg.helpHint,
                size: 'xs',
                color: '#666666',
                margin: 'sm',
                wrap: true,
              },
              {
                type: 'text',
                text: msg.deleteWarning,
                size: 'xs',
                color: '#999999',
                margin: 'sm',
                wrap: true,
              },
            ],
          },
          footer: {
            type: 'box',
            layout: 'vertical',
            spacing: 'sm',
            contents: [
              {
                type: 'button',
                style: 'primary',
                color: '#22c55e',
                action: {
                  type: 'uri',
                  label: '管理画面を開く',
                  uri: liffUrl,
                },
              },
              {
                type: 'button',
                style: 'secondary',
                action: {
                  type: 'uri',
                  label: '使い方を見る',
                  uri: `${baseLiffUrl}/howto`,
                },
              },
              {
                type: 'button',
                style: 'link',
                action: {
                  type: 'uri',
                  label: '友達登録する',
                  uri: botFriendUrl,
                },
              },
            ],
          },
        },
      }],
    });
  } catch (error) {
    console.error('Error in handleJoin:', error);
  }
}

// メンバー参加時
async function handleMemberJoined(event: WebhookEvent & { type: 'memberJoined' }) {
  const source = event.source;
  if (source.type !== 'group') return;

  const groupId = source.groupId;
  const members = event.joined.members;

  for (const member of members) {
    if (member.type !== 'user') continue;

    const userId = member.userId;

    try {
      const profile = await lineClient.getGroupMemberProfile(groupId, userId);

      const { data: userData, error: userError } = await supabase
        .from('users')
        .upsert({
          line_user_id: userId,
          display_name: profile.displayName,
          picture_url: profile.pictureUrl,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'line_user_id',
        })
        .select()
        .single();

      if (userError) {
        console.error('Error saving user:', userError);
        continue;
      }

      const { data: groupData } = await supabase
        .from('groups')
        .select('id')
        .eq('line_group_id', groupId)
        .single();

      if (!groupData) continue;

      await supabase
        .from('group_members')
        .upsert({
          group_id: groupData.id,
          user_id: userData.id,
        }, {
          onConflict: 'group_id,user_id',
        });

      console.log('Member added:', profile.displayName);
    } catch (error) {
      console.error('Error in handleMemberJoined:', error);
    }
  }
}

// Bot がグループ退出時
async function handleLeave(event: WebhookEvent & { type: 'leave' }) {
  const source = event.source;
  if (source.type !== 'group') return;

  const groupId = source.groupId;

  const { error } = await supabase
    .from('groups')
    .delete()
    .eq('line_group_id', groupId);

  if (error) {
    console.error('Error deleting group:', error);
  } else {
    console.log('Group deleted:', groupId);
  }
}

// メンバー退出時
async function handleMemberLeft(event: WebhookEvent & { type: 'memberLeft' }) {
  const source = event.source;
  if (source.type !== 'group') return;

  const groupId = source.groupId;
  const members = event.left.members;

  for (const member of members) {
    if (member.type !== 'user') continue;

    const userId = member.userId;

    try {
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('line_user_id', userId)
        .single();

      if (!userData) continue;

      const { data: groupData } = await supabase
        .from('groups')
        .select('id')
        .eq('line_group_id', groupId)
        .single();

      if (!groupData) continue;

      await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupData.id)
        .eq('user_id', userData.id);

      console.log('Member removed:', userId);
    } catch (error) {
      console.error('Error in handleMemberLeft:', error);
    }
  }
}

// メッセージ受信時
async function handleMessage(event: WebhookEvent & { type: 'message' }) {
  if (event.message.type !== 'text') return;

  const text = event.message.text.toLowerCase();
  const baseLiffUrl = `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}`;

  // グループからのメッセージの場合、ユーザーを group_members に自動登録
  let lineGroupId: string | undefined;
  let dbGroupId: string | undefined;
  if (event.source.type === 'group' && event.source.userId) {
    lineGroupId = event.source.groupId;
    const userId = event.source.userId;

    try {
      // ===== ユーザー情報 =====
      // 既存ユーザーが7日以内に更新されてれば LINE API をスキップ
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, display_name, picture_url, updated_at')
        .eq('line_user_id', userId)
        .maybeSingle();

      const userFreshMs = 7 * 24 * 60 * 60 * 1000;
      const userIsFresh = !!(existingUser?.display_name && existingUser.updated_at
        && Date.now() - new Date(existingUser.updated_at).getTime() < userFreshMs);

      let userData: { id: string; display_name?: string | null; picture_url?: string | null } | null = existingUser;
      if (!userIsFresh) {
        try {
          const profile = await lineClient.getGroupMemberProfile(lineGroupId!, userId);
          const { data: upserted } = await supabase
            .from('users')
            .upsert({
              line_user_id: userId,
              display_name: profile.displayName,
              picture_url: profile.pictureUrl,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'line_user_id' })
            .select()
            .maybeSingle();
          if (upserted) userData = upserted;
        } catch (e) {
          console.log('Could not get member profile:', e);
          // existingUser があればそれで継続
        }
      }

      // ===== グループ情報 =====
      // 既存グループが1日以内に更新されてれば LINE API をスキップ
      const { data: existingGroup } = await supabase
        .from('groups')
        .select('id, name, updated_at')
        .eq('line_group_id', lineGroupId)
        .maybeSingle();

      const groupFreshMs = 24 * 60 * 60 * 1000;
      const groupIsFresh = !!(existingGroup?.name && existingGroup.updated_at
        && Date.now() - new Date(existingGroup.updated_at).getTime() < groupFreshMs);

      let groupData: { id: string; name?: string | null } | null = existingGroup;
      if (!groupIsFresh) {
        let groupName: string | null = existingGroup?.name ?? null;
        try {
          const summary = await lineClient.getGroupSummary(lineGroupId!);
          groupName = summary.groupName;
        } catch (e) {
          console.log('Could not get group name:', e);
        }

        const { data: upserted } = await supabase
          .from('groups')
          .upsert({
            line_group_id: lineGroupId,
            name: groupName,
            last_activity_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, { onConflict: 'line_group_id' })
          .select()
          .maybeSingle();
        if (upserted) groupData = upserted;
      } else {
        // 名前が新鮮なので last_activity_at だけ更新（updated_at は触らない＝1日後の再取得タイミングを保つ）
        await supabase
          .from('groups')
          .update({ last_activity_at: new Date().toISOString() })
          .eq('id', existingGroup!.id);
      }

      // ===== group_members に登録 =====
      if (userData && groupData) {
        await supabase
          .from('group_members')
          .upsert({
            group_id: groupData.id,
            user_id: userData.id,
          }, { onConflict: 'group_id,user_id' });
      }

      if (groupData?.id) {
        dbGroupId = groupData.id;
      }
    } catch (err) {
      console.error('Error registering member:', err);
    }
  }

  const liffUrl = dbGroupId ? `${baseLiffUrl}?groupId=${dbGroupId}` : baseLiffUrl;

  const trimmed = text.trim();

  // キャラクター取得（グループ設定がデフォルト）
  let charType: CharacterType = lineGroupId ? await getCharacterType(lineGroupId) : 'butler';

  // 名指しで呼ばれた場合は、そのキャラで返答（グループ設定を上書き）
  const butlerCalls = ['あそじぃ', 'あそじい', '@あそじぃ', '@あそじい'];
  const penguinCalls = ['あそぺん', '@あそぺん'];
  if (butlerCalls.includes(trimmed)) {
    charType = 'butler';
  } else if (penguinCalls.includes(trimmed)) {
    charType = 'penguin';
  }

  const sender = getSender(charType);

  // 呼びかけ判定：メニュー系コマンド or キャラ名・サービス名（完全一致のみ）
  const calloutKeywords = [
    'メニュー', 'めにゅー', 'menu',
    ...butlerCalls,
    ...penguinCalls,
    'あそぼっと', 'あそボット', 'あそぼーと',
    '@あそぼっと', '@あそボット', '@あそぼーと',
  ];
  const isCalledOut = calloutKeywords.some(k => trimmed === k.toLowerCase());

  // @メンション判定：bot名でメンションされていれば後ろの文字に関係なく反応
  const botMentionNames = ['あそぼっと', 'あそボット', 'あそぼーと'];
  const mention = event.message.type === 'text' ? event.message.mention : undefined;
  const isMentioned = mention?.mentionees.some((m) => {
    if (m.type !== 'user') return false;
    const mentionText = event.message.type === 'text'
      ? event.message.text.slice(m.index, m.index + m.length)
      : '';
    const normalized = mentionText.replace(/^@/, '').toLowerCase();
    return botMentionNames.some((n) => n.toLowerCase() === normalized);
  }) ?? false;

  // 返信メッセージを組み立てる（最後に1回 replyMessage する）
  const messagesToReply: object[] = [];
  let chimeWillFire = false;

  if (isCalledOut || isMentioned) {
    const msg = messageTemplates.menu[charType];
    messagesToReply.push({
      type: 'flex',
      altText: 'メニュー',
      ...(sender && { sender }),
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            { type: 'text', text: msg.title, weight: 'bold', size: 'lg' },
            { type: 'text', text: msg.subtitle, size: 'sm', color: '#666666', margin: 'md' },
          ],
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          spacing: 'sm',
          contents: [
            {
              type: 'button',
              style: 'primary',
              color: '#22c55e',
              action: { type: 'uri', label: '管理画面を開く', uri: liffUrl },
            },
          ],
        },
      },
    });
  } else if (text === '使い方' || text === 'つかいかた' || text === 'help') {
    const howtoUrl = `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}/howto`;
    const msg = messageTemplates.howto[charType];
    const steps = [
      '① 行きたい場所を追加',
      '②「行きたい！」で表明',
      '③ 日程調整',
      '④ 日程を確定',
      '⑤ 参加確認',
    ];
    messagesToReply.push({
      type: 'flex',
      altText: '使い方',
      ...(sender && { sender }),
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            { type: 'text', text: msg.title, weight: 'bold', size: 'lg' },
            { type: 'text', text: msg.subtitle, size: 'sm', color: '#666666', margin: 'md' },
            { type: 'separator', margin: 'lg' },
            { type: 'text', text: '■ 基本の流れ', weight: 'bold', size: 'sm', margin: 'lg' },
            ...steps.map((s) => ({
              type: 'text' as const,
              text: s,
              size: 'sm' as const,
              color: '#444444',
              margin: 'sm' as const,
              wrap: true,
            })),
          ],
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          spacing: 'sm',
          contents: [
            {
              type: 'button',
              style: 'primary',
              color: '#22c55e',
              action: { type: 'uri', label: '詳しい使い方を見る', uri: howtoUrl },
            },
          ],
        },
      },
    });
  } else if (event.source.type === 'user') {
    // 個人トーク（1対1）でキーワードに該当しない場合のデフォルト応答
    const isButler = charType === 'butler';
    const greeting = isButler ? 'お声がけありがとうございます 🎩' : 'メッセージありがとう！🐧';
    const body = isButler
      ? 'ご用件は「メニュー」とお声がけくださいませ。\nグループにお招きいただければ、皆様の予定調整をお手伝いいたします。'
      : 'ご用件は「メニュー」って送ってね！\nグループに呼んでくれたら、みんなの予定調整を手伝うよ！';
    messagesToReply.push({
      type: 'flex',
      altText: greeting,
      ...(sender && { sender }),
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            { type: 'text', text: greeting, weight: 'bold', size: 'md', wrap: true },
            { type: 'text', text: body, size: 'sm', color: '#666666', margin: 'md', wrap: true },
          ],
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          spacing: 'sm',
          contents: [
            {
              type: 'button',
              style: 'primary',
              color: '#22c55e',
              action: { type: 'uri', label: '管理画面を開く', uri: liffUrl },
            },
          ],
        },
      },
    });
  } else if (event.source.type === 'group' && dbGroupId) {
    // チラ見反応：「〜行きたい」「〜行ってみたい」の語尾のみ + クールダウン1時間 + 50%確率
    const original = event.message.text;
    const wishEndingRegex = /(行きたい|行ってみたい|いきたい|いってみたい)(なあ|なぁ|な|ねえ|ねぇ|ね)?[！!]*\s*$/m;
    if (wishEndingRegex.test(original)) {
      try {
        const { data: groupRow } = await supabase
          .from('groups')
          .select('last_chime_at')
          .eq('id', dbGroupId)
          .single();

        const now = new Date();
        const cooldownMs = 60 * 60 * 1000;
        const lastChime = groupRow?.last_chime_at ? new Date(groupRow.last_chime_at) : null;
        const cooldownPassed = !lastChime || (now.getTime() - lastChime.getTime()) >= cooldownMs;

        if (cooldownPassed && Math.random() < 0.5) {
          const chimeText = charType === 'butler'
            ? '（ふむ……ご一緒なさいますか？🎩）'
            : '|ω･)ﾁﾗ 行きたいの？';
          messagesToReply.push({
            type: 'text',
            text: chimeText,
            ...(sender && { sender }),
          });
          chimeWillFire = true;
        }
      } catch (err) {
        console.error('Chime error:', err);
      }
    }
  }

  // pending を吸い上げ（グループのみ・残り枠分）
  let claimedPending: { id: string; payload: object; group_id: string; wish_id: string | null; notification_type: string }[] = [];
  if (event.source.type === 'group' && dbGroupId) {
    const room = 5 - messagesToReply.length;
    if (room > 0) {
      try {
        const { data, error } = await supabase.rpc('claim_pending_notifications', {
          p_group_id: dbGroupId,
          p_limit: room,
        });
        if (error) {
          console.error('Claim pending error:', error);
        } else if (Array.isArray(data) && data.length > 0) {
          claimedPending = data;
          for (const p of claimedPending) {
            messagesToReply.push(p.payload);
          }
        }
      } catch (err) {
        console.error('Claim pending exception:', err);
      }
    }
  }

  if (messagesToReply.length === 0) return;

  try {
    await lineClient.replyMessage({
      replyToken: event.replyToken,
      messages: messagesToReply as Parameters<typeof lineClient.replyMessage>[0]['messages'],
    });

    // 副作用：成功時にコミット
    if (chimeWillFire && dbGroupId) {
      await supabase
        .from('groups')
        .update({ last_chime_at: new Date().toISOString() })
        .eq('id', dbGroupId);
    }

    if (claimedPending.length > 0 && dbGroupId) {
      const logs = claimedPending.map((p) => ({
        group_id: p.group_id,
        wish_id: p.wish_id,
        notification_type: p.notification_type,
        delivery_method: 'reply',
      }));
      await supabase.from('notification_logs').insert(logs);
      await supabase
        .from('pending_notifications')
        .delete()
        .in('id', claimedPending.map((p) => p.id));
      await supabase
        .from('groups')
        .update({ last_activity_at: new Date().toISOString() })
        .eq('id', dbGroupId);
    }
  } catch (err) {
    console.error('Reply error:', err);

    // エラー種別判定：@line/bot-sdk の HTTPError は statusCode を持つ
    const errObj = err as { statusCode?: number; status?: number };
    const statusCode = errObj?.statusCode ?? errObj?.status;
    const isClientError = typeof statusCode === 'number' && statusCode >= 400 && statusCode < 500;

    if (isClientError && claimedPending.length > 0 && dbGroupId) {
      // 4xx（token既使用 / 不正リクエスト 等）: push retry しても成功しないので
      // 配信済み扱いにして pending を削除（重複push を防ぐ）
      console.warn(`Reply 4xx (${statusCode}), treating pending as delivered`);
      try {
        const logs = claimedPending.map((p) => ({
          group_id: p.group_id,
          wish_id: p.wish_id,
          notification_type: p.notification_type,
          delivery_method: 'reply',
        }));
        await supabase.from('notification_logs').insert(logs);
        await supabase
          .from('pending_notifications')
          .delete()
          .in('id', claimedPending.map((p) => p.id));
      } catch (cleanupErr) {
        console.error('Cleanup after 4xx failed:', cleanupErr);
      }
    } else if (claimedPending.length > 0) {
      // 5xx / network: 再試行可能なので claimed_at をリセットして cron に任せる
      try {
        await supabase
          .from('pending_notifications')
          .update({ claimed_at: null })
          .in('id', claimedPending.map((p) => p.id));
      } catch (resetErr) {
        console.error('Reset claimed_at failed:', resetErr);
      }
    }
  }
}

// GET リクエスト対応（ヘルスチェック用）
export async function GET() {
  return NextResponse.json({ status: 'Webhook is running' });
}
