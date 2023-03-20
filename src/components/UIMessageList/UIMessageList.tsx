import React, { useMemo, PropsWithChildren, useState, useEffect } from 'react';
import { Message } from '../../types';
import {
  ChatStateContextValue,
  useChatActionContext,
  useChatStateContext,
  useComponentContext,
  useUIKit,
} from '../../context';
import { useMessageListElements } from './hooks/useMessageListElements';
import { InfiniteScroll, InfiniteScrollProps } from '../InfiniteScrollPaginator';
import { EmptyStateIndicator as DefaultEmptyStateIndicator } from '../EmptyStateIndicator';
import { useConversationState } from '../../hooks';
import { MessageListNotifications as DefaultMessageListNotifications } from './MessageListNotifications';
import { useScrollLocationLogic } from './hooks/useScrollLocationLogic';
import { LoadingIndicator as DefaultLoadingIndicator } from '../Loading';
import { MessageNotification as DefaultMessageNotification } from './MessageNotification';
import './styles/index.scss';


export interface UIMessageListProps extends InfiniteScrollProps {
  className?: string,
  messageList?: Array<Message>,
  highlightedMessageId?: string,
  intervalsTimer?: number,

  /** The pixel threshold to determine whether or not the user is scrolled up in the list, defaults to 200px */
  scrolledUpThreshold?: number;

  /** Function called when latest messages should be loaded, after the list has jumped at an earlier message set */
  jumpToLatestMessage?: () => Promise<void>;
}


export type UIMessageListWithContextProps = ChatStateContextValue & UIMessageListProps;

export const UIMessageList: React.FC = <T extends UIMessageListWithContextProps>(
  props: PropsWithChildren<T>,
) => {
  const {
    messageList: propsMessageList,
    highlightedMessageId: propsHighlightedMessageId,
    loadMore: propsLoadMore,
    loadMoreNewer: loadMoreNewerCallback,
    hasMoreNewer = false,
    suppressAutoscroll,
    intervalsTimer: propsIntervalsTimer,
  } = props;
  const [ulElement, setUlElement] = useState<HTMLUListElement | null>(null);
  const { jumpToLatestMessage } = useChatActionContext();

  const {
    highlightedMessageId: contextHighlightedMessageId,
    messageListRef,
    UIMessageListConfig,
  } = useChatStateContext();

  const { 
    UIMessage, 
    EmptyStateIndicator = DefaultEmptyStateIndicator,
    LoadingIndicator = DefaultLoadingIndicator,
    MessageListNotifications = DefaultMessageListNotifications,
    MessageNotification = DefaultMessageNotification,
  } = useComponentContext('UIMessageList');
  const { messages: contextMessageList, hasMore, loadingMore, loadMore: contextLoadMore } = useChatStateContext('UIMessageList');

  const highlightedMessageId = propsHighlightedMessageId
  || UIMessageListConfig?.highlightedMessageId
  || contextHighlightedMessageId;
  const intervalsTimer = (propsIntervalsTimer || UIMessageListConfig?.intervalsTimer || 30) * 60;

  const messages = propsMessageList || contextMessageList;
  /*
  const { messageList: enrichedMessageList } = useEnrichedMessageList({
    messageList: propsMessageList || UIMessageListConfig?.messageList || contextMessageList,
  });*/
  const enrichedMessageList = messages;

  const loadMore = propsLoadMore || UIMessageListConfig?.loadMore || contextLoadMore;

  const {
    hasNewMessages,
    isMessageListScrolledToBottom,
    onMessageLoadCaptured,
    onScroll,
    scrollToBottom,
    wrapperRect,
  } = useScrollLocationLogic({
    hasMoreNewer,
    messageListRef,
    messages,
    scrolledUpThreshold: props.scrolledUpThreshold,
    suppressAutoscroll,
  });

  const scrollToBottomFromNotification = React.useCallback(async () => {
    if (hasMoreNewer) {
      await jumpToLatestMessage();
    } else {
      scrollToBottom();
    }
  }, [scrollToBottom, hasMoreNewer]);

  React.useLayoutEffect(() => {
    if (highlightedMessageId) {
      const element = ulElement?.querySelector(`[data-message-id='${highlightedMessageId}']`);
      element?.scrollIntoView({ block: 'center' });
    }
  }, [highlightedMessageId]);

  const elements = useMessageListElements({
    enrichedMessageList,
    UIMessage,
    intervalsTimer,
    internalMessageProps: {
      messageListRect: wrapperRect,
    },
    onMessageLoadCaptured,
  });

  return (
    <>
      <div 
        className={`uim-message-list`} 
        onScroll={onScroll}
        ref={messageListRef}
        tabIndex={0}
      >
        {!hasMore && <p className="no-more">没有更多</p>}
        <InfiniteScroll
          className="message-list-infinite-scroll"
          hasMore
          loader={
            <div className='uim__list__loading' key='loading-indicator'>
              {loadingMore && <LoadingIndicator size={20} />}
            </div>
          }
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
      <MessageListNotifications
        hasNewMessages={hasNewMessages}
        isMessageListScrolledToBottom={isMessageListScrolledToBottom}
        isNotAtLatestMessageSet={hasMoreNewer}
        MessageNotification={MessageNotification}
        scrollToBottom={scrollToBottomFromNotification}
      />
    </>
  );
}