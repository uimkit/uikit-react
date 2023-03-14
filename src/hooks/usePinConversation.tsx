import { useCallback } from 'react';
import { useDispatch } from '../store/useDispatch';
import { useUIKit } from '../context';
import { fetchConversationsByAccount } from '../store/conversations';

export interface UsePinConversationResult {
  mutate: (conversationID: string, pinned: boolean) => void;
}

export function usePinConversation(): UsePinConversationResult {
  const dispatch = useDispatch();
  const { client, activeProfile } = useUIKit('usePinConversation');

  const mutate = useCallback(async (conversationID: string, pinned: boolean) => {
    await client.pinConversation(conversationID, pinned);
    dispatch(fetchConversationsByAccount(activeProfile.id));
  }, [client, activeProfile]);
  
  return {
    mutate,
  };
}