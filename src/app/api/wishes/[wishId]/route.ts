import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { requireAuth } from '@/lib/auth';
import { notifyConfirmStart, notifyDateConfirmed } from '@/lib/line/notification';

// 行きたい更新
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ wishId: string }> }
) {
  try {
    // 認証確認
    const auth = await requireAuth(request);
    if (auth instanceof Response) return auth;

    const { wishId } = await params;
    const body = await request.json();
    const { 
      votingStarted, 
      confirmedDate, 
      voteDeadline,
      // 編集用フィールド
      title,
      description,
      startDate,
      startTime,
      endDate,
      endTime,
      isAllDay
    } = body;

    // 更新前のデータを取得
    const { data: beforeData } = await supabase
      .from('wishes')
      .select('title, group_id, start_date, start_time, voting_started, status')
      .eq('id', wishId)
      .single();

    const updateData: Record<string, unknown> = {};
    
    // 状態更新フィールド
    if (votingStarted !== undefined) updateData.voting_started = votingStarted;
    if (confirmedDate !== undefined) {
      updateData.confirmed_date = confirmedDate;
      updateData.status = 'confirmed';
    }
    if (voteDeadline !== undefined) updateData.vote_deadline = voteDeadline;
    
    // 編集フィールド
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (startDate !== undefined) updateData.start_date = startDate;
    if (startTime !== undefined) updateData.start_time = startTime;
    if (endDate !== undefined) updateData.end_date = endDate;
    if (endTime !== undefined) updateData.end_time = endTime;
    if (isAllDay !== undefined) updateData.is_all_day = isAllDay;

    const { data, error } = await supabase
      .from('wishes')
      .update(updateData)
      .eq('id', wishId)
      .select()
      .single();

    if (error) {
      console.error('Error updating wish:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 参加確認開始通知（更新後のdataを使用して最新の値で通知）
    if (votingStarted && !beforeData?.voting_started && data?.group_id && data?.title && data?.start_date) {
      const [y, m, d] = data.start_date.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      const wd = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
      let dateStr = `${m}/${d}(${wd})`;
      if (data.start_time) dateStr += ` ${data.start_time.slice(0, 5)}`;

      const liffUrl = `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}/wishes/${wishId}/confirm?groupId=${data.group_id}`;
      notifyConfirmStart(data.group_id, wishId, data.title, dateStr, liffUrl).catch(console.error);
    }

    // 日程確定通知
    if (confirmedDate && data?.group_id && data?.title) {
      const [y, m, d] = confirmedDate.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      const wd = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
      const dateStr = `${m}/${d}(${wd})`;

      notifyDateConfirmed(data.group_id, wishId, data.title, dateStr).catch(console.error);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 行きたい削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ wishId: string }> }
) {
  try {
    // 認証確認
    const auth = await requireAuth(request);
    if (auth instanceof Response) return auth;
    const { userId: lineUserId } = auth;

    const { wishId } = await params;

    // ユーザーID取得
    const { data: userData } = await supabase
      .from('users')
      .select('id')
      .eq('line_user_id', lineUserId)
      .single();

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 作成者チェック
    const { data: wish } = await supabase
      .from('wishes')
      .select('created_by')
      .eq('id', wishId)
      .single();

    if (!wish || wish.created_by !== userData.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const { error } = await supabase
      .from('wishes')
      .delete()
      .eq('id', wishId);

    if (error) {
      console.error('Error deleting wish:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
