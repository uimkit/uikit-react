import { Cursor, GetGroupListParameters, Group } from '../../../types';
import { useUIKit } from '../../../context';
import { useCallback, useEffect, useState } from "react";


export function useGroupList(
  accountId: string | undefined,
  query?: GetGroupListParameters,
  activeGroupHandler?: (
    groups: Group[],
    setGroups: React.Dispatch<React.SetStateAction<Group[]>>,
  ) => void,
) {
  const { client } = useUIKit('useGroupList');
  const [error, setError] = useState<Error | undefined>(undefined);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [nextCursor, setNextCursor] = useState<Cursor | undefined>(undefined);
  const [groups, setGroups] = useState<Group[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const fetch = useCallback(async (queryType?: string, nextCursor?: Cursor) => {
    try {
      setLoading(true);

      const limit = query?.limit ??  50;

      if (queryType === 'reload') {
        setGroups([]);
      }

      const cursor = queryType === 'reload' ? undefined : nextCursor;
      const newQuery = {...query, account_id: accountId, cursor, limit };

      const response = await client.getGroupList(newQuery);
      const newGroups = queryType === 'reload' ? response.data : [...groups, ...response.data];

      setGroups(newGroups);
      setHasMore(response.extra.has_next);
      setNextCursor(response.extra.end_cursor);

      if (activeGroupHandler) {
        activeGroupHandler(newGroups, setGroups);
      }
    } catch(e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [client, query, accountId]);

  useEffect(() => {
    if (accountId) fetch('reload');
  }, [fetch, accountId]);

  const loadMore = useCallback(() => {
    if (accountId) fetch(undefined, nextCursor)
  }, [fetch, accountId, nextCursor]);

  const reload = useCallback(() => {
    if (accountId) fetch('reload');
  }, [fetch, accountId]);

  return {
    loading,
    error,
    groups,
    reload,
    hasMore,
    loadMore,
  };
}