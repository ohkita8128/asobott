import { NextRequest, NextResponse } from 'next/server';
import { WebhookEvent } from '@line/bot-sdk';
import { lineClient } from '@/lib/line/client';
import { supabase } from '@/lib/supabase/client';

type CharacterType = 'butler' | 'penguin';

// キャラクター設定
const characters = {
  butler: {
    name: 'あそボット',
    iconUrl: undefined,
  },
  penguin: {
    name: 'あそボット',
    iconUrl: 'https://asobott.vercel.app/icons/penguin-icon.png',
  },
};

// メッセージテンプレート
const messageTemplates = {
  follow: {
    butler: `あそボットと申します 🎩

グループの「いつか行きたいね」を「この日に行こう！」に変えるお手伝いをいたします。

まずはグループへお招きください。`,
    penguin: `あそボットだよ 🐧

グループの「いつか行きたいね」を「この日に行こう！」にするよ！

グループに招待してね！`,
  },
  join: {
    butler: {
      title: 'お招きありがとうございます 🎩',
      subtitle: 'あそボットと申します。',
      description: '皆様が集まる機会、もっと増やしましょう。',
    },
    penguin: {
      title: 'グループに呼んでくれてありがとう！🐧',
      subtitle: 'あそボットだよ。',
      description: 'みんなで遊ぶ予定、もっと増やそう！',
    },
  },
  menu: {
    butler: {
      title: '🎩 あそボット',
      subtitle: 'ご用命はこちらから。',
    },
    penguin: {
      title: '🐧 あそボット',
      subtitle: 'なにかあったらここからね！',
    },
  },
  howto: {
    butler: {
      title: '🎩 あそボット',
      subtitle: '使い方をご案内いたします。',
    },
    penguin: {
      title: '🐧 あそボット',
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

    // 友達追加はグループ外なので、デフォルトのペンギンで返答
    const charType: CharacterType = 'penguin';
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
                text: msg.subtitle,
                size: 'sm',
                color: '#666666',
                margin: 'sm',
              },
              {
                type: 'text',
                text: msg.description,
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
                text: '💡 使い方',
                weight: 'bold',
                size: 'sm',
                margin: 'lg',
              },
              {
                type: 'text',
                text: '1. 管理画面から行きたい場所を追加\n2. 興味ある人が「行きたい！」と反応\n3. 人気があれば日程調整 → 決定！',
                size: 'xs',
                color: '#666666',
                margin: 'sm',
                wrap: true,
              },
              {
                type: 'separator',
                margin: 'lg',
              },
              {
                type: 'text',
                text: '📱 友達登録がおすすめ',
                weight: 'bold',
                size: 'sm',
                margin: 'lg',
              },
              {
                type: 'text',
                text: '登録すると、いつでもメニューから管理画面を開けるよ。',
                size: 'xs',
                color: '#666666',
                margin: 'sm',
                wrap: true,
              },
              {
                type: 'text',
                text: '💬 「メニュー」と送っても開けます',
                size: 'xs',
                color: '#666666',
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
  const liffUrl = `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}`;

  // グループからのメッセージの場合、ユーザーを group_members に自動登録
  let lineGroupId: string | undefined;
  if (event.source.type === 'group' && event.source.userId) {
    lineGroupId = event.source.groupId;
    const userId = event.source.userId;

    try {
      // ユーザー情報を取得・登録
      const profile = await lineClient.getGroupMemberProfile(lineGroupId!, userId);
      
      const { data: userData } = await supabase
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

      // グループ情報を取得（グループ名は毎回最新を取得）
      let { data: groupData } = await supabase
        .from('groups')
        .select('id, name')
        .eq('line_group_id', lineGroupId)
        .single();

      // グループ名を取得して更新（毎回最新に）
      let groupName = null;
      try {
        const groupSummary = await lineClient.getGroupSummary(lineGroupId!);
        groupName = groupSummary.groupName;
      } catch (e) {
        console.log('Could not get group name:', e);
      }

      // グループがない、または名前が変わった場合は更新
      if (!groupData || groupData.name !== groupName) {
        const { data: upsertedGroup } = await supabase
          .from('groups')
          .upsert({
            line_group_id: lineGroupId,
            name: groupName,
            last_activity_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'line_group_id',
          })
          .select()
          .single();
        
        groupData = upsertedGroup;
        if (groupName) {
          console.log('Group name updated:', groupName);
        }
      } else {
        // 名前が同じでもlast_activity_atは更新
        await supabase
          .from('groups')
          .update({ last_activity_at: new Date().toISOString() })
          .eq('line_group_id', lineGroupId);
      }

      // group_members に登録
      if (userData && groupData) {
        await supabase
          .from('group_members')
          .upsert({
            group_id: groupData.id,
            user_id: userData.id,
          }, {
            onConflict: 'group_id,user_id',
          });
        console.log('Member registered via message:', profile.displayName);
      }
    } catch (err) {
      console.error('Error registering member:', err);
    }
  }

  // キャラクター取得
  const charType = lineGroupId ? await getCharacterType(lineGroupId) : 'penguin';
  const sender = getSender(charType);

  if (text === 'メニュー' || text === 'めにゅー' || text === 'menu') {
    const msg = messageTemplates.menu[charType];
    
    await lineClient.replyMessage({
      replyToken: event.replyToken,
      messages: [{
        type: 'flex',
        altText: 'メニュー',
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
                size: 'lg',
              },
              {
                type: 'text',
                text: msg.subtitle,
                size: 'sm',
                color: '#666666',
                margin: 'md',
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
            ],
          },
        },
      }],
    });
  }

  // 使い方コマンド
  if (text === '使い方' || text === 'つかいかた' || text === 'help') {
    const howtoUrl = `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}/howto`;
    const msg = messageTemplates.howto[charType];
    
    await lineClient.replyMessage({
      replyToken: event.replyToken,
      messages: [{
        type: 'flex',
        altText: '使い方',
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
                size: 'lg',
              },
              {
                type: 'text',
                text: msg.subtitle,
                size: 'sm',
                color: '#666666',
                margin: 'md',
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
                  label: '使い方を見る',
                  uri: howtoUrl,
                },
              },
            ],
          },
        },
      }],
    });
  }
}

// GET リクエスト対応（ヘルスチェック用）
export async function GET() {
  return NextResponse.json({ status: 'Webhook is running' });
}
