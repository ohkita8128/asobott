// 認証付きfetcher
export const authFetcher = async (url: string, token: string | null) => {
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const error = new Error('Failed to fetch') as Error & { status?: number };
    error.status = res.status;
    throw error;
  }
  return res.json();
};

// 通常のfetcher（後方互換）
export const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
});

// 認証付きPOST/PATCH/DELETE用
export const authRequest = async (
  url: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  token: string | null,
  body?: object
) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = new Error('Request failed') as Error & { status?: number };
    error.status = res.status;
    throw error;
  }

  // DELETEは204が返ることがある
  if (res.status === 204) return null;
  
  return res.json();
};

// SWRのキー
export const swrKeys = {
  wishes: (groupId: string) => `/api/groups/${groupId}/wishes`,
  members: (groupId: string) => `/api/groups/${groupId}/members`,
  settings: (groupId: string) => `/api/groups/${groupId}/settings`,
  userGroups: (lineUserId: string) => `/api/user-groups?lineUserId=${lineUserId}`,
  groupByLineId: (lineGroupId: string) => `/api/groups/by-line-id?lineGroupId=${lineGroupId}`,
  schedule: (wishId: string) => `/api/wishes/${wishId}/schedule`,
};
