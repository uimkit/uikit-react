import { useCallback, useEffect, useState } from 'react';
import { Cursor, GetContactMomentListParameters, Moment, MomentType } from '../../../types';
import { useUIKit } from '../../../context';


export const useMomentList = (userId: string, query?: GetContactMomentListParameters) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [nextCursor, setNextCursor] = useState<Cursor | undefined>(undefined);
  const [moments, setMoments] = useState<Moment[] | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);

  const { client } = useUIKit('useMomentList');

  const fetch = useCallback(async (queryType?: string, nextCursor?: Cursor) => {
    try {
      setLoading(true);

      const limit = query?.limit ??  20;

      if (queryType === 'reload') {
        setMoments([]);
      }

      const cursor = queryType === 'reload' ? undefined : nextCursor;
      const newQuery = {
        ...query, 
        contact_id: userId, 
        cursor, 
        limit,
      };

      const response = await client.getContactMomentList(newQuery);
      const newMoments = queryType === 'reload' ? response.data : [...moments, ...response.data];

      const newMoments1 = [
        {
          id: '1',
          type: MomentType.Video,          
        },
        {
          id: '2',
          type: MomentType.Video,
        }
      ];

      setMoments(newMoments1);
      setHasMore(response.extra.has_next);
      setNextCursor(response.extra.end_cursor);
    } catch(e) {
      console.error(e);
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [client, query, userId]);

  useEffect(() => {
    if (userId) fetch('reload');
  }, [fetch, userId]);

  const loadMore = useCallback(() => {
    if (userId) fetch(undefined, nextCursor)
  }, [fetch, userId, nextCursor]);

  const reload = useCallback(() => {
    if (userId) fetch('reload');
  }, [fetch, userId]);

  return {
    loading,
    hasMore,
    moments,
    error,
    reload,
    loadMore,
  };
}