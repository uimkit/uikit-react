import { useEffect, useCallback } from 'react';
import { Conversation } from "../types";
import { ConversationListIndexedByAccount, fetchConversationsByAccount, getConversationsByAccount, getConversationsStateByAccount, hasMoreConversationsByAccount, isFetchingConversationsByAccount } from "../store/conversations";
import { useDispatch } from '../store/useDispatch';
import { useSelector } from 'react-redux';
import { AppState } from '../store/types';

export interface UseConversationListResult {
  conversations: Conversation[];
  loadMore: () => void;
  loading: boolean;
  hasMore: boolean;
  error: Error;
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


  const { conversations, cursor, loading, error } = useSelector<AppState, ConversationListIndexedByAccount>(getConversationsStateByAccount(accountId));

  return {
    loadMore,
    conversations,
    loading,
    error,
    hasMore: cursor?.has_next ?? false,
  };
}