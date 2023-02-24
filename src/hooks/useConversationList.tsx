import { useEffect } from 'react';
import { Conversation } from "../types";
import { fetchConversationsByAccount, getConversationsByAccount } from "../store/conversations";
import { useDispatch } from '../store/useDispatch';
import { useSelector } from 'react-redux';
import { AppState } from '../store/types';

export interface UseConversationListResult {
  conversations: Conversation[];
}

export function useConversationList(accountId: string): UseConversationListResult {
  const dispatch = useDispatch();

  useEffect(() => {
    if (accountId) {
      dispatch(fetchConversationsByAccount(accountId))
    }
  }, [accountId]);

  const conversations = useSelector<AppState, Conversation[]>(getConversationsByAccount(accountId));

  return {
    conversations,
  };
}