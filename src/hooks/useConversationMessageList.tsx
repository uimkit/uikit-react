import { useEffect, useCallback } from 'react';
import { fetchConversationHistoryMessages, fetchConversationNewMessages, getMessagesInConversation, hasMoreHistoryMessagesInConversation, isFetchingMessagesInConversation } from '../store/messages';
import { useSelector } from 'react-redux';
import { useDispatch } from '../store/useDispatch';
import { Message } from "../types";
import { AppState } from '../store/types';

export interface UseConversationMessageListResult {
  messages: Message[];
  hasMore: boolean;
  loading: boolean;
  loadMore: () => void;
}

export function useConversationMessageList(conversationId: string): UseConversationMessageListResult {
  const dispatch = useDispatch();

  useEffect(() => {
    if (conversationId) {
      dispatch(fetchConversationNewMessages(conversationId));
    }
  }, [conversationId]);

  const loadMore = useCallback(() => {
    if (conversationId) {
      dispatch(fetchConversationHistoryMessages(conversationId));
    }
  }, [conversationId]);

  const messages = useSelector<AppState, Message[]>(getMessagesInConversation(conversationId));
  const loading = useSelector<AppState, boolean>(isFetchingMessagesInConversation(conversationId));
  const hasMore = useSelector<AppState, boolean>(hasMoreHistoryMessagesInConversation(conversationId));

  return {
    messages,
    hasMore,
    loadMore,
    loading,
  }
}