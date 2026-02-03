import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { requireAuth } from '@/lib/auth';

// 行きたいリスト取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { groupId } = await params;

    const { data, error } = await supabase
      .from('wishes')
      .select(`
        *,
        created_by_user:users!wishes_created_by_fkey(display_name, picture_url),
        interests(
          id,
          user_id,
          users(display_name, picture_url)
        ),
        wish_responses(
          id,
          user_id,
          response,
          users(display_name, picture_url)
        )
      `)
      .eq('group_id', groupId)
      .in('status', ['open', 'voting'])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching wishes:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 行きたい追加
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    // 認証確認
    const auth = await requireAuth(request);
    if (auth instanceof Response) return auth;
    const { userId: lineUserId } = auth;

    const { groupId } = await params;
    const body = await request.json();
    const { title, description, isAnonymous, startDate, startTime, endDate, endTime, isAllDay } = body;

    // ユーザーID取得
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('line_user_id', lineUserId)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 行きたい作成
    const { data, error } = await supabase
      .from('wishes')
      .insert({
        group_id: groupId,
        title,
        description,
        created_by: userData.id,
        is_anonymous: isAnonymous ?? false,
        start_date: startDate || null,
        start_time: startTime || null,
        end_date: endDate || null,
        end_time: endTime || null,
        is_all_day: isAllDay ?? false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating wish:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 作成者の「行きたい！」を自動で追加
    await supabase
      .from('interests')
      .insert({
        wish_id: data.id,
        user_id: userData.id,
      });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
