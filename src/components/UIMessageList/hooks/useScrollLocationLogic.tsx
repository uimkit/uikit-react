import React, { RefObject, useCallback, useLayoutEffect, useRef, useState } from 'react';

import { useMessageListScrollManager } from './useMessageListScrollManager';
import { Message } from '../../../types';

export type UseScrollLocationLogicParams = {
  hasMoreNewer: boolean;
  messageListRef: RefObject<HTMLDivElement> | null;
  suppressAutoscroll: boolean;
  currentUserId?: string;
  messages?: Message[];
  scrolledUpThreshold?: number;
};

export const useScrollLocationLogic = (
  params: UseScrollLocationLogicParams,
) => {
  const {
    messages = [],
    scrolledUpThreshold = 200,
    hasMoreNewer,
    suppressAutoscroll,
    messageListRef,
  } = params;


  console.log('useScrollLocationLogic');

  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [wrapperRect, setWrapperRect] = useState<DOMRect>();

  const [isMessageListScrolledToBottom, setIsMessageListScrolledToBottom] = useState(true);
  const closeToBottom = useRef(false);
  const closeToTop = useRef(false);
  const scrollCounter = useRef({ autoScroll: 0, scroll: 0 });

  const scrollToBottom = useCallback(() => {
    if (!messageListRef?.current?.scrollTo || hasMoreNewer || suppressAutoscroll) {
      return;
    }

    scrollCounter.current.autoScroll += 1;
    messageListRef.current.scrollTo({
      top: messageListRef.current.scrollHeight,
    });
    setHasNewMessages(false);
  }, [messageListRef, hasMoreNewer, suppressAutoscroll]);

  useLayoutEffect(() => {
    if (messageListRef.current) {
      console.log('useLayoutEffect');
      setWrapperRect(messageListRef.current.getBoundingClientRect());
      scrollToBottom();
    }
  }, [messageListRef, hasMoreNewer]);

  const updateScrollTop = useMessageListScrollManager({
    messages,
    onScrollBy: (scrollBy) => {
      messageListRef.current?.scrollBy({ top: scrollBy });
    },

    scrollContainerMeasures: () => ({
      offsetHeight: messageListRef.current?.offsetHeight || 0,
      scrollHeight: messageListRef.current?.scrollHeight || 0,
    }),
    scrolledUpThreshold,
    scrollToBottom,
    showNewMessages: () => setHasNewMessages(true),
  });

  const onScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const element = event.target as HTMLDivElement;
      const scrollTop = element.scrollTop;

      updateScrollTop(scrollTop);

      const offsetHeight = element.offsetHeight;
      const scrollHeight = element.scrollHeight;

      const prevCloseToBottom = closeToBottom.current;
      closeToBottom.current = scrollHeight - (scrollTop + offsetHeight) < scrolledUpThreshold;
      closeToTop.current = scrollTop < scrolledUpThreshold;

      if (closeToBottom.current) {
        setHasNewMessages(false);
      }
      if (prevCloseToBottom && !closeToBottom.current) {
        setIsMessageListScrolledToBottom(false);
      } else if (!prevCloseToBottom && closeToBottom.current) {
        setIsMessageListScrolledToBottom(true);
      }
    },
    [updateScrollTop, closeToTop, closeToBottom, scrolledUpThreshold],
  );

  const onMessageLoadCaptured = useCallback(() => {
    /**
     * A load event (emitted by e.g. an <img>) was captured on a message.
     * In some cases, the loaded asset is larger than the placeholder, which means we have to scroll down.
     */
    if (closeToBottom.current) {
      scrollToBottom();
    }
  }, [closeToTop, closeToBottom, scrollToBottom]);

  return {
    hasNewMessages,
    isMessageListScrolledToBottom,
    onMessageLoadCaptured,
    onScroll,
    scrollToBottom,
    wrapperRect,
  };
};