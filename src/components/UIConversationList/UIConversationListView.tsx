import React from 'react';
import { Conversation } from "../../types";
import { UIConversationPreview, UIConversationPreviewComponentProps } from '../UIConversationPreview/UIConversationPreview';
import { EmptyStateIndicator } from '../EmptyStateIndicator';
import { InfiniteScroll } from '../InfiniteScrollPaginator';

export type UIConversationListViewProps = {
  activeConversation?: Conversation;
  setActiveConversation?: (conversation: Conversation) => void;
  conversations: Conversation[];
  loadMore?: () => void;
  hasMore?: boolean;
  Preview?: React.ComponentType<UIConversationPreviewComponentProps>,
};

export function UIConversationListView({ 
  activeConversation,
  setActiveConversation,
  conversations,
  loadMore,
  hasMore,
  Preview,
}: UIConversationListViewProps) {
  const noMore = true;

  return (
    <div className="conversation-list">
      <InfiniteScroll
        className="conversation-list-infinite-scroll"
        hasMore={hasMore}
        loadMore={loadMore}
        threshold={1}
      >
        <ul>
          {
            conversations?.length > 0 ? (
              conversations.map(conversation => (
                <UIConversationPreview 
                  key={conversation.id} 
                  conversation={conversation}
                  activeConversation={activeConversation}
                  setActiveConversation={setActiveConversation}
                  Preview={Preview}
                  conversationUpdateCount={0}
                />
              ))
            ) : <EmptyStateIndicator listType="conversation" />
          }
        </ul>
      </InfiniteScroll>
      {noMore && <p className="no-more">没有更多</p>}
    </div>
  );
}