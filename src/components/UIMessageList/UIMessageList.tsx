import React, { PropsWithChildren, useState, useEffect } from 'react';
import { Message } from '../../types';
import {
  useChatActionContext,
  useComponentContext,
  useUIKit,
} from '../../context';
import useMessageListElement from './hooks/useMessageListElement';

import { InfiniteScroll, InfiniteScrollProps } from '../InfiniteScrollPaginator';

import { EmptyStateIndicator as DefaultEmptyStateIndicator } from '../EmptyStateIndicator';

import './styles/index.scss';
import { useChatState, useConversationMessageList } from '../../hooks';

export interface MessageListProps extends InfiniteScrollProps {
  className?: string,
  messageList?: Array<Message>,
  highlightedMessageId?: string,
  intervalsTimer?: number,
}

export function UIMessageList <T extends MessageListProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    messageList: propsMessageList,
    highlightedMessageId: propsHighlightedMessageId,
    loadMore: propsLoadMore,
    intervalsTimer: propsIntervalsTimer,
  } = props;

  const [ulElement, setUlElement] = useState<HTMLUListElement | null>(null);
  const [firstRender, setFirstRender] = useState<boolean>(false);

  const {
    highlightedMessageId: contextHighlightedMessageId,
    messageListRef,
    // UIMessageListConfig,
  } = useChatState();

  const isSameLastMessageID = true;

  const { UIMessage, EmptyStateIndicator = DefaultEmptyStateIndicator } = useComponentContext('UIMessageList');

  const highlightedMessageId = propsHighlightedMessageId
  // || UIMessageListConfig?.highlightedMessageId
  || contextHighlightedMessageId;
  const intervalsTimer = (propsIntervalsTimer /*|| UIMessageListConfig?.intervalsTimer*/ || 30) * 60;

  const { activeConversation } = useUIKit();
  const { setHighlightedMessageId } = useChatActionContext('UIMessageList'); // 应该把这里的行为打散解构到不同的 hook 中.
  const { messages: contextMessageList, hasMore, loading, loadMore: contextLoadMore } = useConversationMessageList(activeConversation?.id);

  /*
  const { messageList: enrichedMessageList } = useEnrichedMessageList({
    messageList: propsMessageList || UIMessageListConfig?.messageList || contextMessageList,
  });*/
  const enrichedMessageList = propsMessageList /*|| UIMessageListConfig?.messageList*/ || contextMessageList

  const loadMore = propsLoadMore /*|| UIMessageListConfig?.loadMore*/ || contextLoadMore;

  const elements = useMessageListElement({
    enrichedMessageList,
    UIMessage,
    intervalsTimer,
  });

  useEffect(() => {
    (async () => {
      const parentElement = ulElement?.parentElement?.parentElement;
      if (!loading && parentElement?.clientHeight >= ulElement?.clientHeight) {
        await loadMore();
      }

      if (ulElement?.children && (!firstRender || !isSameLastMessageID)) {
        const HTMLCollection = ulElement?.children || [];
        const element = HTMLCollection[HTMLCollection.length - 1];
        const timer = setTimeout(() => {
          element?.scrollIntoView({ block: 'end' });
          setFirstRender(true);
          clearTimeout(timer);
        }, 100);
      }
    })();
  }, [elements, firstRender]);

  useEffect(() => {
    if (highlightedMessageId) {
      const element = ulElement?.querySelector(`[data-message-id='${highlightedMessageId}']`);
      if (!element) {
        return;
      }
      const { children } = element.children[1];
      children[children.length - 1].classList.add('high-lighted');
      element?.scrollIntoView({ block: 'center' });
      const timer = setTimeout(() => {
        children[children.length - 1].classList.remove('high-lighted');
        clearTimeout(timer);
        setHighlightedMessageId('');
      }, 1000);
    }
  }, [highlightedMessageId]);

  return (
    <div className={`message-list ${!firstRender ? 'hide' : ''}`} ref={messageListRef}>
      {!hasMore && <p className="no-more">没有更多</p>}
      <InfiniteScroll
        className="message-list-infinite-scroll"
        hasMore
        loadMore={loadMore}
        threshold={1}
      >
        <ul ref={setUlElement}>
          {
              elements?.length > 0 ? elements : <EmptyStateIndicator listType="message" />
            }
        </ul>
      </InfiniteScroll>
    </div>
  );
}