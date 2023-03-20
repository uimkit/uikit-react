import { useEffect, useRef } from 'react';
import { Message } from '../../../types';



export function useShouldForceScrollToBottom(messages: Message[], currentUserId?: string) {
  const lastFocusedOwnMessage = useRef('');
  const initialFocusRegistered = useRef(false);

  function recheckForNewOwnMessage() {
    if (messages && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      // 最后一条消息是自己发的, 就更新关联
      if (
        lastMessage.from === currentUserId &&
        lastFocusedOwnMessage.current !== lastMessage.id
      ) {
        lastFocusedOwnMessage.current = lastMessage.id;
        return true;
      }
    }
    return false;
  }

  useEffect(() => {
    if (messages && messages.length && !initialFocusRegistered.current) {
      initialFocusRegistered.current = true;
      recheckForNewOwnMessage();
    }
  }, [messages, messages?.length]);

  return recheckForNewOwnMessage;
}
