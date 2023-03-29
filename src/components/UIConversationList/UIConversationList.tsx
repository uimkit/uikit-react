import React from 'react';
import { useUIKit } from "../../context";
import { UIConversationListView } from "./UIConversationListView";
import { UIConversationListHeader } from "../UIConversationListHeader";
import { useConversationList } from "../../hooks/useConversationList";

import './styles/index.scss';
import { Conversation } from '../../types';


export type UIConversationListProps = {
  conversations?: Conversation[];
}

export const UIConversationList: React.FC<UIConversationListProps> = (props) => {
  const {
    conversations: propConversations,
  } = props;

  const { activeConversation, setActiveConversation } = useUIKit();
  const { conversations: contextConversations, loadMore, loading, hasMore  } = useConversationList(activeConversation?.account);

  const conversations = propConversations?? contextConversations;

  return (
    <div className="uim-conversation">
      <UIConversationListHeader />
      <UIConversationListView 
        activeConversation={activeConversation}
        setActiveConversation={setActiveConversation}
        conversations={conversations} 
        loadMore={loadMore}
        loading={loading}
        hasMore={hasMore}
      />
    </div>
  );
}