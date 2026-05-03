'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { useLiff } from './use-liff';
import { fetcher, swrKeys } from '@/lib/swr/fetcher';

type Group = {
  group_id: string;
  user_id: string;
  groups: { id: string; name: string; last_activity_at: string };
};

export function useGroup() {
  const { profile, context, accessToken, isReady } = useLiff();
  const searchParams = useSearchParams();
  const registeredRef = useRef(false);

  // URLパラメータからgroupIdを取得
  const paramGroupId = searchParams.get('groupId');

  // LINE GroupIDからDB GroupIDを取得
  const lineGroupId = context.groupId?.startsWith('C') ? context.groupId : null;
  const { data: groupByLineId } = useSWR(
    lineGroupId && !paramGroupId ? swrKeys.groupByLineId(lineGroupId) : null,
    fetcher
  );

  // ユーザーの所属グループを取得
  const { data: userGroups, isLoading: isLoadingGroups, mutate: mutateUserGroups } = useSWR<Group[]>(
    profile?.userId ? swrKeys.userGroups(profile.userId) : null,
    fetcher
  );

  // グループIDとユーザーIDを取得
  const myUserId = userGroups?.[0]?.user_id || null;

  // LIFF開いた時にユーザーを自動登録
  useEffect(() => {
    if (!isReady || !profile || registeredRef.current) return;
    registeredRef.current = true;

    const registerUser = async () => {
      try {
        await fetch('/api/register-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lineUserId: profile.userId,
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl,
            lineGroupId: lineGroupId,
            groupId: paramGroupId,
          }),
        });
        if (lineGroupId || paramGroupId) {
          mutateUserGroups();
        }
      } catch (err) {
        console.error('Error registering user:', err);
      }
    };

    registerUser();
  }, [isReady, profile, lineGroupId, paramGroupId, mutateUserGroups]);

  // URL / コンテキスト / userGroups から派生してgroupId/groupNameを決定
  const { groupId, groupName } = useMemo(() => {
    if (!isReady) return { groupId: null as string | null, groupName: null as string | null };

    // 1. URLパラメータがあればそれを使う
    if (paramGroupId) {
      const found = userGroups?.find(g => g.group_id === paramGroupId);
      return { groupId: paramGroupId, groupName: found?.groups?.name || null };
    }

    // 2. LINEグループIDから取得
    if (groupByLineId?.id) {
      return {
        groupId: groupByLineId.id as string,
        groupName: (groupByLineId.name as string) || null,
      };
    }

    // 3. 所属グループからlast_activity_at順で先頭
    if (userGroups && userGroups.length > 0) {
      const sorted = [...userGroups].sort((a, b) => {
        const aTime = a.groups?.last_activity_at || '1970-01-01';
        const bTime = b.groups?.last_activity_at || '1970-01-01';
        return bTime.localeCompare(aTime);
      });
      return { groupId: sorted[0].group_id, groupName: sorted[0].groups?.name || null };
    }

    return { groupId: null, groupName: null };
  }, [isReady, paramGroupId, groupByLineId, userGroups]);

  return {
    groupId,
    groupName,
    allGroups: userGroups || [],
    myUserId,
    accessToken,
    isLoading: !isReady || (isLoadingGroups && !groupId),
    isReady,
    profile,
  };
}
