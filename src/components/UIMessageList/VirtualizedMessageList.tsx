import React, { useMemo, PropsWithChildren, useState, useEffect, useRef, useCallback } from 'react';
import { Conversation, Message, UnknownType } from '../../types';
import {
  useChatActionContext,
  useChatStateContext,
  useComponentContext,
} from '../../context';
import { EmptyStateIndicator as DefaultEmptyStateIndicator } from '../EmptyStateIndicator';
import { MessageListNotifications as DefaultMessageListNotifications } from './MessageListNotifications';
import { LoadingIndicator as DefaultLoadingIndicator } from '../Loading';
import { MessageNotification as DefaultMessageNotification } from './MessageNotification';
import './styles/index.scss';
import {
  Components,
  ScrollSeekConfiguration,
  ScrollSeekPlaceholderProps,
  Virtuoso,
  VirtuosoHandle,
  VirtuosoProps,
} from 'react-virtuoso';
import { DateSeparator } from '../DateSeparator';
import { useShouldForceScrollToBottom } from './hooks/useShouldForceScrollToBottom';
import { useNewMessageNotification } from './hooks/useNewMessageNotification';
import { usePrependedMessagesCount } from './hooks/usePrependedMessagesCount';
import { UIMessage, UIMessageProps } from '../UIMessage';

const PREPEND_OFFSET = 10 ** 7;

export type VirtualizedMessageListProps = {
  UIMessage?: React.ComponentType<UIMessageProps>;
  className?: string;
  messages?: Message[];
  intervalsTimer?: number;

  hasMore?: boolean;
  hasMoreNewer?: boolean;
  loadMore?: () => Promise<void>;
  loadMoreNewer?: () => Promise<void>;
  /** Whether or not the list is currently loading more items */
  loadingMore?: boolean;
  /** Whether or not the list is currently loading newer items */
  loadingMoreNewer?: boolean;
  head?: React.ReactElement;
  /** The id of the message to highlight and center */
  highlightedMessageId?: string;
  /** 自定义 render 函数, 如果设置, UIMessage 属性会被忽略 */
  customMessageRenderer?: (
    messages: Message[],
    index: number,
  ) => React.ReactElement;
  /** If set, the default item height is used for the calculation of the total list height. Use if you expect messages with a lot of height variance */
  defaultItemHeight?: number;
  /** Additional props to be passed the underlying [`react-virtuoso` virtualized list dependency](https://virtuoso.dev/virtuoso-api-reference/) */
  additionalVirtuosoProps?: VirtuosoProps<UnknownType, unknown>;
  /** The scrollTo behavior when new messages appear. Use `"smooth"` for regular chat channels, and `"auto"` (which results in instant scroll to bottom) if you expect high throughput. */
  stickToBottomScrollBehavior?: 'smooth' | 'auto';
  /** 当新消息加载时停止列表的自动滚动 */
  suppressAutoscroll?: boolean;
  /** When `true`, the list will scroll to the latest message when the window regains focus */
  scrollToLatestMessageOnFocus?: boolean;
  /** The amount of extra content the list should render in addition to what's necessary to fill in the viewport */
  overscan?: number;
  /**
   * Performance improvement by showing placeholders if user scrolls fast through list.
   * it can be used like this:
   * ```
   *  {
   *    enter: (velocity) => Math.abs(velocity) > 120,
   *    exit: (velocity) => Math.abs(velocity) < 40,
   *    change: () => null,
   *    placeholder: ({index, height})=> <div style={{height: height + "px"}}>{index}</div>,
   *  }
   *  ```
   */
  scrollSeekPlaceHolder?: ScrollSeekConfiguration & {
    placeholder: React.ComponentType<ScrollSeekPlaceholderProps>;
  };
}


export type VirtualizedMessageListWithContextProps = VirtualizedMessageListProps & {
  conversation: Conversation;
  hasMore: boolean;
  hasMoreNewer: boolean;
  /** Function called when latest messages should be loaded, after the list has jumped at an earlier message set */
  jumpToLatestMessage: () => Promise<void>;
  loadingMore: boolean;
  loadingMoreNewer: boolean;
};


function captureResizeObserverExceededError(e: ErrorEvent) {
  if (
    e.message === 'ResizeObserver loop completed with undelivered notifications.' ||
    e.message === 'ResizeObserver loop limit exceeded'
  ) {
    e.stopImmediatePropagation();
  }
}

function useCaptureResizeObserverExceededError() {
  useEffect(() => {
    window.addEventListener('error', captureResizeObserverExceededError);
    return () => {
      window.removeEventListener('error', captureResizeObserverExceededError);
    };
  }, []);
}

function fractionalItemSize(element: HTMLElement) {
  return element.getBoundingClientRect().height;
}

function findMessageIndex(messages: Array<{ id: string }>, id: string) {
  return messages.findIndex((message) => message.id === id);
}

function calculateInitialTopMostItemIndex(
  messages: Array<{ id: string }>,
  highlightedMessageId: string | undefined,
) {
  if (highlightedMessageId) {
    const index = findMessageIndex(messages, highlightedMessageId);
    if (index !== -1) {
      console.log('calculateInitialTopMostItemIndex: ', index);
      return { align: 'center', index } as const;
    }
  }
  return messages.length - 1;
}

const VirtualizedMessageListWithContext: React.FC<PropsWithChildren<VirtualizedMessageListWithContextProps>> = (props) => {
  const {
    additionalVirtuosoProps,
    conversation,
    messages,
    highlightedMessageId,
    intervalsTimer,
    hasMore,
    loadMore,
    loadingMore,
    hasMoreNewer,
    loadMoreNewer,
    loadingMoreNewer,
    suppressAutoscroll,
    jumpToLatestMessage,
    head,
    defaultItemHeight,
    customMessageRenderer,
    stickToBottomScrollBehavior = 'smooth',
    overscan = 0,
    scrollSeekPlaceHolder,
    scrollToLatestMessageOnFocus = false,
    UIMessage: propMessage,
  } = props;

  useCaptureResizeObserverExceededError();

  const { 
    UIMessage: contextMessage = UIMessage,
    EmptyStateIndicator = DefaultEmptyStateIndicator,
    LoadingIndicator = DefaultLoadingIndicator,
    MessageListNotifications = DefaultMessageListNotifications,
    MessageNotification = DefaultMessageNotification,
  } = useComponentContext('VirtualizedMessageList');

  const MessageUIComponent = propMessage || contextMessage;

  const processedMessages = useMemo(() => {
    if (typeof messages === 'undefined') {
      return [];
    }

    return messages;
  }, [
    messages,
    messages?.length,
  ]);

  const virtuoso = useRef<VirtuosoHandle>(null);

  const {
    atBottom,
    isMessageListScrolledToBottom,
    newMessagesNotification,
    setIsMessageListScrolledToBottom,
    setNewMessagesNotification,
  } = useNewMessageNotification(processedMessages, conversation.account, hasMoreNewer);

  const scrollToBottom = useCallback(async () => {
    if (hasMoreNewer) {
      await jumpToLatestMessage();
      return;
    }

    if (virtuoso.current) {
      virtuoso.current.scrollToIndex(processedMessages.length - 1);
    }

    setNewMessagesNotification(false);
  }, [
    virtuoso,
    processedMessages,
    setNewMessagesNotification,
    // processedMessages were incorrectly rebuilt with a new object identity at some point, hence the .length usage
    processedMessages.length,
    hasMoreNewer,
    jumpToLatestMessage,
  ]);

  const [newMessagesReceivedInBackground, setNewMessagesReceivedInBackground] = React.useState(
    false,
  );

  const resetNewMessagesReceivedInBackground = useCallback(() => {
    setNewMessagesReceivedInBackground(false);
  }, []);

  useEffect(() => {
    setNewMessagesReceivedInBackground(true);
  }, [messages]);

  const scrollToBottomIfConfigured = useCallback(
    (event: Event) => {
      if (scrollToLatestMessageOnFocus && event.target === window) {
        if (newMessagesReceivedInBackground) {
          setTimeout(scrollToBottom, 100);
        }
      }
    },
    [scrollToLatestMessageOnFocus, scrollToBottom, newMessagesReceivedInBackground],
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', scrollToBottomIfConfigured);
      window.addEventListener('blur', resetNewMessagesReceivedInBackground);
    }

    return () => {
      window.removeEventListener('focus', scrollToBottomIfConfigured);
      window.removeEventListener('blur', resetNewMessagesReceivedInBackground);
    };
  }, [scrollToBottomIfConfigured]);

  // 在前面追加的消息数，也就是 loadMore 加载的消息总量
  const numItemsPrepended = usePrependedMessagesCount(processedMessages);
  const [messageSetKey, setMessageSetKey] = useState(+new Date());
  const firstMessageId = useRef<string | undefined>();

  useEffect(() => {
    const continuousSet = messages?.find((message) => message.id === firstMessageId.current);
    if (!continuousSet) {
      setMessageSetKey(+new Date());
    }
    firstMessageId.current = messages?.[0]?.id;
  }, [messages]);

  // 是否要强制滚动到最底部
  const shouldForceScrollToBottom = useShouldForceScrollToBottom(processedMessages, conversation.account);

  // 列表 totalCount 改变时调用
  const followOutput = (isAtBottom: boolean) => {
    if (hasMoreNewer || suppressAutoscroll) {
      return false;
    }

    if (shouldForceScrollToBottom()) {
      return isAtBottom ? stickToBottomScrollBehavior : 'auto';
    }
    // a message from another user has been received - don't scroll to bottom unless already there
    return isAtBottom ? stickToBottomScrollBehavior : false;
  };

  const messageRenderer = useCallback(
    (messages: Message[], virtuosoIndex: number) => {
      const messageIndex = virtuosoIndex + numItemsPrepended - PREPEND_OFFSET;
      // use custom renderer supplied by client if present and skip the rest
      if (customMessageRenderer) {
        return customMessageRenderer(messages, messageIndex);
      }

      const message = messages[messageIndex];
      const preMessageTimer = messageIndex > 0 ? messages[messageIndex - 1]?.sent_at: -1;
      const currrentTimer = message?.sent_at ?? 0;
      const isShowIntervalsTimer = preMessageTimer !== -1 ? (currrentTimer - preMessageTimer) >= intervalsTimer : false;

      if (!message) return <div style={{ height: '1px' }}></div>; // returning null or zero height breaks the virtuoso

      return (
        <li className="message-list-item">
          {
            isShowIntervalsTimer && <DateSeparator date={currrentTimer ? new Date(currrentTimer) : null} />
          }
          <MessageUIComponent message={message} />
        </li>
      );
    },
    [customMessageRenderer, numItemsPrepended],
  );

  const virtuosoComponents: Partial<Components> = useMemo(() => {
    const EmptyPlaceholder: Components['EmptyPlaceholder'] = () => (
      <>
        {EmptyStateIndicator && (
          <EmptyStateIndicator listType={'message'} />
        )}
      </>
    );

    const Header: Components['Header'] = () =>
      loadingMore ? (
        <div className='uim__virtual-list__loading'>
          <LoadingIndicator size={20} />
        </div>
      ) : (
        head || null
      );

    /*
    const Footer: Components['Footer'] = () =>
      TypingIndicator ? <TypingIndicator avatarSize={24} /> : <></>;
    */
    const Footer: Components['Footer'] = () => <></>;

    return {
      EmptyPlaceholder,
      Footer,
      Header,
    };
  }, [loadingMore, head]);

  const atBottomStateChange = (isAtBottom: boolean) => {
    atBottom.current = isAtBottom;
    setIsMessageListScrolledToBottom(isAtBottom);
    if (isAtBottom && newMessagesNotification) {
      setNewMessagesNotification(false);
    }
  };

  const startReached = () => {
    console.log('startReached hasMore: ', hasMore, !!loadMore);
    if (hasMore && loadMore) {
      loadMore();
    }
  };

  const endReached = () => {
    console.log('endReached hasMoreNewer: ', hasMoreNewer, !!loadMoreNewer);
    if (hasMoreNewer && loadMoreNewer) {
      loadMoreNewer();
    }
  };

  useEffect(() => {
    if (highlightedMessageId) {
      const index = findMessageIndex(processedMessages, highlightedMessageId);
      if (index !== -1) {
        virtuoso.current?.scrollToIndex({ align: 'center', index });
      }
    }
  }, [highlightedMessageId]);

  console.log(`
    messages: ${processedMessages.length},
    hasMore: ${hasMore},
    hasMoreNewer: ${hasMoreNewer},
    loadingMore: ${loadingMore},
    loadingMoreNewer: ${loadingMoreNewer}
  `);

  return (
    <div className={`uim-message-list`}>
      <Virtuoso
        atBottomStateChange={atBottomStateChange}
        atBottomThreshold={200}
        className='uim__message-list-scroll'
        components={virtuosoComponents}
        computeItemKey={(index) =>
          processedMessages[numItemsPrepended + index - PREPEND_OFFSET].id
        }
        endReached={endReached}
        firstItemIndex={PREPEND_OFFSET - numItemsPrepended}
        followOutput={followOutput}
        increaseViewportBy={{ bottom: 200, top: 0 }}
        initialTopMostItemIndex={calculateInitialTopMostItemIndex(
          processedMessages,
          highlightedMessageId,
        )}
        itemContent={(i) => messageRenderer(processedMessages, i)}
        itemSize={fractionalItemSize}
        key={messageSetKey}
        overscan={overscan}
        ref={virtuoso}
        startReached={startReached}
        style={{ overflowX: 'hidden' }}
        totalCount={processedMessages.length}
        {...additionalVirtuosoProps}
        {...(scrollSeekPlaceHolder ? { scrollSeek: scrollSeekPlaceHolder } : {})}
        {...(defaultItemHeight ? { defaultItemHeight } : {})}
      />
      <MessageListNotifications
        hasNewMessages={newMessagesNotification}
        isMessageListScrolledToBottom={isMessageListScrolledToBottom}
        isNotAtLatestMessageSet={hasMoreNewer}
        MessageNotification={MessageNotification}
        scrollToBottom={scrollToBottom}
      />
    </div>
  );
}


export const VirtualizedMessageList: React.FC<VirtualizedMessageListProps> = (props) => {
  const { 
    messages: propMessages,
    intervalsTimer: propsIntervalsTimer,
    hasMore: propHasMore,
    loadMore: propLoadMore,
    loadingMore: propLoadingMore,
    hasMoreNewer: propHasMoreNewer,
    loadingMoreNewer: propLoadingMoreNewer,
    loadMoreNewer: propLoadMoreNewer,
    ...rest
  } = props;

  const { 
    jumpToLatestMessage,
    loadMore: contextLoadMore,
    loadMoreNewer: contextLoadMoreNewer,
  } = useChatActionContext('VirtualizedMessageList');
  const {
    conversation,
    highlightedMessageId,
    suppressAutoscroll,
    messages: contextMessages,
    hasMore: contextHasMore,
    loadingMore: contextLoadingMore,    
    hasMoreNewer: contextHasMoreNewer,
    loadingMoreNewer: contextLoadingMoreNewer,
  } = useChatStateContext('VirtualizedMessageList');

  const hasMore = propHasMore ?? contextHasMore;
  const loadMore = propLoadMore ?? contextLoadMore;
  const loadingMore = propLoadingMore ?? contextLoadingMore;
  const hasMoreNewer = propHasMoreNewer ?? contextHasMoreNewer;
  const loadingMoreNewer = propHasMoreNewer ?? contextLoadingMoreNewer;
  const loadMoreNewer = propLoadMoreNewer ?? contextLoadMoreNewer;

  const intervalsTimer = (propsIntervalsTimer ?? 30) * 60;
  const messages = propMessages || contextMessages;
   

  return (
    <VirtualizedMessageListWithContext
      conversation={conversation}
      hasMore={!!hasMore}
      hasMoreNewer={!!hasMoreNewer}
      highlightedMessageId={highlightedMessageId}
      jumpToLatestMessage={jumpToLatestMessage}
      loadingMore={!!loadingMore}
      loadingMoreNewer={!!loadingMoreNewer}
      loadMore={loadMore}
      loadMoreNewer={loadMoreNewer}
      messages={messages}
      suppressAutoscroll={suppressAutoscroll}
      intervalsTimer={intervalsTimer}
      {...rest}
    />
  );
}