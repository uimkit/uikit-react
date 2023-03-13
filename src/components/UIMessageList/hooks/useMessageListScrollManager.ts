import { useEffect, useRef } from 'react';
import { Message } from '../../../types';
import { useUIKit } from '../../../context';

export type ContainerMeasures = {
  offsetHeight: number;
  scrollHeight: number;
};

export type UseMessageListScrollManagerParams = {
  messages: Message[];
  onScrollBy: (scrollBy: number) => void;
  scrollContainerMeasures: () => ContainerMeasures;
  scrolledUpThreshold: number;
  scrollToBottom: () => void;
  showNewMessages: () => void;
};

export function useMessageListScrollManager(params: UseMessageListScrollManagerParams) {
  const {
    onScrollBy,
    scrollContainerMeasures,
    scrolledUpThreshold,
    scrollToBottom,
    showNewMessages,
  } = params;

  const { activeProfile } = useUIKit('useMessageListScrollManager');

  const measures = useRef<ContainerMeasures>({
    offsetHeight: 0,
    scrollHeight: 0,
  });
  const messages = useRef<Message[]>();
  const scrollTop = useRef(0);

  useEffect(() => {
    const prevMeasures = measures.current;
    const prevMessages = messages.current;
    const newMessages = params.messages;
    const lastNewMessage = newMessages[newMessages.length - 1] ?? {} as Message;
    const lastPrevMessage = prevMessages?.[prevMessages.length - 1];
    const newMeasures = scrollContainerMeasures();

    const wasAtBottom =
      prevMeasures.scrollHeight - prevMeasures.offsetHeight - scrollTop.current <
      scrolledUpThreshold;

    if (typeof prevMessages !== 'undefined') {
      if (prevMessages.length < newMessages.length) {
        // messages added to the top
        if (lastPrevMessage?.id === lastNewMessage.id) {
          const listHeightDelta = newMeasures.scrollHeight - prevMeasures.scrollHeight;
          if (scrollTop.current === 0) {
            onScrollBy(listHeightDelta);
          }
        }
        // messages added to the bottom
        else {
          const lastMessageIsFromCurrentUser = lastNewMessage.from === activeProfile.id;

          if (lastMessageIsFromCurrentUser || wasAtBottom) {
            scrollToBottom();
          } else {
            showNewMessages();
          }
        }
      }
      // message list length didn't change, but check if last message had reaction/reply update
      else {
        /* TODO
        const hasNewReactions = lastPrevMessage?.latest_reactions?.length !== lastNewMessage.latest_reactions?.length;
        const hasNewReplies = lastPrevMessage?.reply_count !== lastNewMessage.reply_count;

        if ((hasNewReactions || hasNewReplies) && wasAtBottom) {
          scrollToBottom();
        }
        */
      }
    }

    messages.current = newMessages;
    measures.current = newMeasures;
  }, [measures, messages, params.messages]);

  return (scrollTopValue: number) => {
    scrollTop.current = scrollTopValue;
  };
}