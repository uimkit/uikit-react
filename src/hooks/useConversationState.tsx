import { useEffect, useCallback, useRef } from 'react';
import { 
  ConversationActionType,
  ConversationState, 
  fetchConversationHistoryMessages, 
  fetchConversationNewMessages, 
  getConversationState,
} from '../store/messages';
import { useSelector } from 'react-redux';
import { useDispatch } from '../store/useDispatch';
import { AppState } from '../store/types';
import { Message } from '../types';

export type UseConversationStateResult {
  messages: Message[];
  hasMore: boolean;
  loadingMore: boolean;
  loadMore: () => Promise<void>;
  hasMoreNewer: boolean;
  loadingMoreNewer: boolean;
  loadMoreNewer: () => Promise<void>;
  jumpToMessage: (messageId: string, limit?: number) => Promise<void>;
  highlightedMessageId?: string;
  suppressAutoscroll?: boolean;
}

export function useConversationState(conversationId: string): UseConversationStateResult {
  const dispatch = useDispatch();

  const { 
    messages,
    loadingMore,
    hasMore,
    loadingMoreNewer,
    hasMoreNewer,
    suppressAutoscroll,
    highlightedMessageId
  } = useSelector<AppState, ConversationState>(getConversationState(conversationId));

  console.log(`loadingMore: ${loadingMore}, hasMore: ${hasMore}, loadingMoreNewer: ${loadingMoreNewer}, hasMoreNewer: ${hasMoreNewer}`);

  useEffect(() => {
    if (conversationId && (!messages || messages.length === 0)) {
      dispatch(fetchConversationNewMessages(conversationId));
    }
  }, [conversationId, messages]);

  const loadMore = useCallback(async () => {
    if (conversationId) {
      dispatch(fetchConversationHistoryMessages(conversationId));
    }
  }, [conversationId]);

  const loadMoreNewer = useCallback(async () => {
    if (conversationId) {
      // TODO 这个持续before翻页是有bug的
      // dispatch(fetchConversationNewMessages(conversationId));
    }
  }, [conversationId]);

  const clearHighlightedMessageTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);

  const jumpToMessage = useCallback(async (messageId: string, limit = 100) => {
    const conversation = { id: conversationId };

    dispatch({
      type: ConversationActionType.JumpToMessageFinished,
      conversation,
      highlightedMessageId: messageId,
      hasMoreNewer: false,
    });

    if (clearHighlightedMessageTimeoutId.current) {
      clearTimeout(clearHighlightedMessageTimeoutId.current);
    }

    clearHighlightedMessageTimeoutId.current = setTimeout(() => {
      clearHighlightedMessageTimeoutId.current = null;
      dispatch({ 
        type: ConversationActionType.ClearHighlightedMessage,
        conversation: { id: conversationId },  
      });
    }, 500);
  }, [conversationId, messages]);

  return {
    messages,
    hasMore,
    loadingMore,
    loadMore,
    hasMoreNewer,
    loadingMoreNewer,
    loadMoreNewer,
    jumpToMessage,
    suppressAutoscroll,
    highlightedMessageId,
  }
}