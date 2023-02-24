import { useEffect } from 'react';
import { fetchConversationNewMessages, getMessagesInConversation } from '../store/messages';
import { useSelector } from 'react-redux';
import { useDispatch } from '../store/useDispatch';
import { Message } from "../types";
import { AppState } from '../store/types';

export interface UseConversationMessageListResult {
  messages: Message[];
}

export function useConversationMessageList(conversationId: string): UseConversationMessageListResult {
  const dispatch = useDispatch();

  useEffect(() => {
    if (conversationId) {
      dispatch(fetchConversationNewMessages(conversationId));
    }
  }, [conversationId]);

  const messages = useSelector<AppState, Message[]>(getMessagesInConversation(conversationId));

  return {
    messages,
  }
}