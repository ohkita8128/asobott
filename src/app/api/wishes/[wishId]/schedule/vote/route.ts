import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

// 投票保存
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ wishId: string }> }
) {
  try {
    const { wishId } = await params;
    const body = await request.json();
    const { lineUserId, votes } = body;

    if (!lineUserId || !votes || !Array.isArray(votes)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // ユーザーID取得
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('line_user_id', lineUserId)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 既存の投票を削除
    const { data: candidates } = await supabase
      .from('schedule_candidates')
      .select('id')
      .eq('wish_id', wishId);

    if (candidates && candidates.length > 0) {
      const candidateIds = candidates.map(c => c.id);
      await supabase
        .from('schedule_votes')
        .delete()
        .eq('user_id', userData.id)
        .in('candidate_id', candidateIds);
    }

    // 新しい投票を追加
    const insertData = votes
      .filter((v: { candidateId: string; availability: string }) => v.availability)
      .map((v: { candidateId: string; availability: string }) => ({
        candidate_id: v.candidateId,
        user_id: userData.id,
        availability: v.availability
      }));

    if (insertData.length > 0) {
      const { error } = await supabase
        .from('schedule_votes')
        .insert(insertData);

      if (error) {
        console.error('Error saving votes:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
