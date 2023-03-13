import React, { PropsWithChildren, useState, useEffect } from 'react';
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
import { useConversationMessageList } from '../../hooks';
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
  const [firstRender, setFirstRender] = useState<boolean>(false);

  const { jumpToLatestMessage } = useChatActionContext();

  const {
    highlightedMessageId: contextHighlightedMessageId,
    messageListRef,
    UIMessageListConfig,
  } = useChatStateContext();

  const isSameLastMessageID = true;

  const { 
    UIMessage, 
    EmptyStateIndicator = DefaultEmptyStateIndicator,
    LoadingIndicator = DefaultLoadingIndicator,
    MessageListNotifications = DefaultMessageListNotifications,
    MessageNotification = DefaultMessageNotification,
  } = useComponentContext('UIMessageList');

  const highlightedMessageId = propsHighlightedMessageId
  || UIMessageListConfig?.highlightedMessageId
  || contextHighlightedMessageId;
  const intervalsTimer = (propsIntervalsTimer || UIMessageListConfig?.intervalsTimer || 30) * 60;

  const { activeConversation } = useUIKit();
  const { setHighlightedMessageId } = useChatActionContext('UIMessageList'); // 应该把这里的行为打散解构到不同的 hook 中.
  const { messages: contextMessageList, hasMore, loading, loadMore: contextLoadMore } = useConversationMessageList(activeConversation?.id);

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


  const elements = useMessageListElements({
    enrichedMessageList,
    UIMessage,
    intervalsTimer,
    internalMessageProps: {
      messageListRect: wrapperRect,
    },
    onMessageLoadCaptured,
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
    <>
      <div 
        className={`message-list ${!firstRender ? 'hide' : ''}`} 
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
              {loading && <LoadingIndicator size={20} />}
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