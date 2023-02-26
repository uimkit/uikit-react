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
  loading?: boolean;
  hasMore?: boolean;
  Preview?: React.ComponentType<UIConversationPreviewComponentProps>,
};

export function UIConversationListView({ 
  activeConversation,
  setActiveConversation,
  conversations,
  loadMore,
  loading,
  hasMore,
  Preview,
}: UIConversationListViewProps) {
  return (
    <div className="conversation-list">
      <InfiniteScroll
        className="conversation-list-infinite-scroll"
        hasMoreNewer={hasMore}
        loadMoreNewer={loadMore}
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
      {loading && <p className="loading">加载中</p>}   
      {!hasMore && <p className="no-more">没有更多</p>}
    </div>
  );
}