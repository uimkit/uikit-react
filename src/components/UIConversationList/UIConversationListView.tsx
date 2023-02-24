import React from 'react';
import { Conversation } from "../../types";
import { InfiniteList } from '../InfiniteList';
import { UIConversationPreview, UIConversationPreviewComponentProps } from '../UIConversationPreview/UIConversationPreview';

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
  return (
    <InfiniteList
      itemSize={64}
      items={conversations}
      isLoadingMore={false}
      loadingMoreTip={'加载更多'}
      hasMore={hasMore}
      noMoreTip={'没有更多'}
      onLoadMore={loadMore}
      render={(conversation) => (
        <UIConversationPreview 
          key={conversation.id} 
          conversation={conversation}
          activeConversation={activeConversation}
          setActiveConversation={setActiveConversation}
          Preview={Preview}
          conversationUpdateCount={0}
        />
      )}
    />
  );
}