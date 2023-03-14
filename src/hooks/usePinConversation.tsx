import { useCallback } from 'react';
import { useDispatch } from '../store/useDispatch';
import { useUIKit } from '../context';

export interface UsePinConversationResult {
  mutate: (conversationID: string, pinned: boolean) => void;
}

export function usePinConversation(): UsePinConversationResult {
  const dispatch = useDispatch();
  const { client } = useUIKit('usePinConversation');

  const mutate = useCallback((conversationID: string, pinned: boolean) => {
    client.pinConversation(conversationID, pinned);
    // dispatch(pinConversation(conversationID, pinned));
  }, []);
  
  return {
    mutate,
  };
}