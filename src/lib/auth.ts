// LINEアクセストークンを検証してユーザーIDを取得
export async function verifyLineToken(authHeader: string | null): Promise<{ userId: string } | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const accessToken = authHeader.slice(7); // 'Bearer ' を除去

  try {
    // LINEのトークン検証API
    const verifyRes = await fetch(`https://api.line.me/oauth2/v2.1/verify?access_token=${accessToken}`);
    
    if (!verifyRes.ok) {
      console.error('Token verification failed');
      return null;
    }

    const verifyData = await verifyRes.json();
    
    // LIFF IDが自分のものか確認
    const expectedChannelId = process.env.NEXT_PUBLIC_LIFF_ID?.split('-')[0];
    if (verifyData.client_id !== expectedChannelId) {
      console.error('Invalid client_id');
      return null;
    }

    // トークンからプロフィール取得
    const profileRes = await fetch('https://api.line.me/v2/profile', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!profileRes.ok) {
      console.error('Failed to get profile');
      return null;
    }

    const profile = await profileRes.json();
    return { userId: profile.userId };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

// 認証必須のAPIで使うヘルパー
export async function requireAuth(request: Request): Promise<{ userId: string } | Response> {
  const auth = await verifyLineToken(request.headers.get('Authorization'));
  
  if (!auth) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return auth;
}
