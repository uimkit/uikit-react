import { useEffect, useCallback } from 'react';
import { Conversation } from "../types";
import { fetchConversationsByAccount, getConversationsByAccount, hasMoreConversationsByAccount, isFetchingConversationsByAccount } from "../store/conversations";
import { useDispatch } from '../store/useDispatch';
import { useSelector } from 'react-redux';
import { AppState } from '../store/types';

export interface UseConversationListResult {
  conversations: Conversation[];
  loadMore: () => void;
  loading: boolean;
  hasMore: boolean;
}

export function useConversationList(accountId: string): UseConversationListResult {
  const dispatch = useDispatch();

  useEffect(() => {
    if (accountId) {
      dispatch(fetchConversationsByAccount(accountId))
    }
  }, [accountId]);

  const loadMore = useCallback(() => {
    if (accountId) {
      dispatch(fetchConversationsByAccount(accountId, true))
    }
  }, [accountId]);


  const conversations = useSelector<AppState, Conversation[]>(getConversationsByAccount(accountId));
  const hasMore = useSelector<AppState, boolean>(hasMoreConversationsByAccount(accountId));
  const loading = useSelector<AppState, boolean>(isFetchingConversationsByAccount(accountId));

  return {
    conversations,
    loading,
    loadMore,
    hasMore
  };
}