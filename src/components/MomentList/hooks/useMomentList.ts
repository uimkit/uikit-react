import { useCallback, useState } from 'react';
import { Moment } from '../../../types';


export const useMomentList = (userId: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [moments, setMoments] = useState<Moment[] | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);

  const reload = useCallback(() => {}, []);
  const loadMore = useCallback(() => {}, []);

  return {
    loading,
    hasMore,
    moments,
    error,
    reload,
    loadMore,
  };
}