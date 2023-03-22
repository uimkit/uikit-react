import { useCallback } from 'react';
import { useUIKit } from '../context';

export interface UseDeleteConversationResult {
  mutate: (conversationID: string) => void;
}

export function useDeleteConversation(): UseDeleteConversationResult {
  const { client } = useUIKit('useDeleteConversation');

  const mutate = useCallback((conversationID: string) => {
    client.deleteConversation(conversationID);
  }, []);
  
  return {
    mutate,
  };
}