import { Cursor, GetGroupMemberListParameters, GroupMember } from '../../../types';
import { useUIKit } from '../../../context';
import { useCallback, useEffect, useState } from "react";
import { MAX_QUERY_GROUP_MEMBER_LIMIT } from '../../../constants';


export function useGroupMemberList(
  query: GetGroupMemberListParameters,
  activeMemberHandler: (
    members: GroupMember[],
    setMembers: React.Dispatch<React.SetStateAction<GroupMember[]>>,
  ) => void,
) {
  const { client } = useUIKit('useGroupMembers');
  const [error, setError] = useState<Error | undefined>(undefined);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [nextCursor, setNextCursor] = useState<Cursor | undefined>(undefined);
  const [members, setMembers] = useState<GroupMember[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const fetch = useCallback(async (queryType?: string) => {
    try {
      setLoading(true);

      const limit = query.limit ??  MAX_QUERY_GROUP_MEMBER_LIMIT;

      if (queryType === 'reload') {
        setMembers([]);
      }

      const cursor = queryType === 'reload' ? undefined : nextCursor;
      const newQuery = {...query, cursor, limit };

      const response = await client.getGroupMembers(newQuery);
      const newMembers = queryType === 'reload' ? response.data : [...members, ...response.data];

      setMembers(newMembers);
      setHasMore(response.extra.has_next);
      setNextCursor(response.extra.end_cursor);

      if (activeMemberHandler) {
        activeMemberHandler(newMembers, setMembers);
      }
    } catch(e) {
      console.error(e);
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [client, query, nextCursor]);

  useEffect(() => {
    fetch('reload');
  }, [client]);

  const loadMore = useCallback(() => {
    fetch()
  }, [nextCursor]);

  const reload = useCallback(() => {
    fetch('reload');
  }, [fetch]);

  return {
    loading,
    error,
    members,
    reload,
    hasMore,
    loadMore,
  };
}