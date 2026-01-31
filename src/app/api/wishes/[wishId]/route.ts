import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

// 行きたい更新
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ wishId: string }> }
) {
  try {
    const { wishId } = await params;
    const body = await request.json();
    const { votingStarted } = body;

    const updateData: Record<string, unknown> = {};
    if (votingStarted !== undefined) updateData.voting_started = votingStarted;

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
    const { wishId } = await params;

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
