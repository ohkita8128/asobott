import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { requireAuth } from '@/lib/auth';

// 回答を保存/更新/削除
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ wishId: string }> }
) {
  try {
    // 認証確認
    const auth = await requireAuth(request);
    if (auth instanceof Response) return auth;
    const { userId: lineUserId } = auth;

    const { wishId } = await params;
    const body = await request.json();
    const { response } = body;

    // ユーザーID取得
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('line_user_id', lineUserId)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 空文字の場合は削除
    if (!response || response === '') {
      const { error } = await supabase
        .from('wish_responses')
        .delete()
        .eq('wish_id', wishId)
        .eq('user_id', userData.id);

      if (error) {
        console.error('Error deleting response:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ deleted: true });
    }

    // upsert
    const { data, error } = await supabase
      .from('wish_responses')
      .upsert({
        wish_id: wishId,
        user_id: userData.id,
        response,
      }, { onConflict: 'wish_id,user_id' })
      .select()
      .single();

    if (error) {
      console.error('Error saving response:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 回答を取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ wishId: string }> }
) {
  try {
    const { wishId } = await params;

    const { data, error } = await supabase
      .from('wish_responses')
      .select(`
        *,
        users(display_name, picture_url)
      `)
      .eq('wish_id', wishId);

    if (error) {
      console.error('Error fetching responses:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
