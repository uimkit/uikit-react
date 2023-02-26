import { useCallback } from 'react';
import { useDispatch } from '../store/useDispatch';

export interface UsePinConversationResult {
  mutate: (conversationID: string, pinned: boolean) => void;
}

export function usePinConversation(): UsePinConversationResult {
  const dispatch = useDispatch();

  const mutate = useCallback((conversationID: string, pinned: boolean) => {
    // dispatch(pinConversation(conversationID, pinned));
  }, []);
  
  return {
    mutate,
  };
}