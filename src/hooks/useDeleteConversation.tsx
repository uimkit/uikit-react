import { useCallback } from 'react';
import { useDispatch } from '../store/useDispatch';

export interface UseDeleteConversationResult {
  mutate: (conversationID: string) => void;
}

export function useDeleteConversation(): UseDeleteConversationResult {
  const dispatch = useDispatch();

  const mutate = useCallback((conversationID: string) => {
    // TODO dispatch(deleteConversation(conversationID));
  }, []);
  
  return {
    mutate,
  };
}