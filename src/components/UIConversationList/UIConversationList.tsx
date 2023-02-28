import React from 'react';
import { useUIKit } from "../../context";
import { UIConversationListView } from "./UIConversationListView";
import { UIConversationListHeader } from "../UIConversationListHeader";
import { useConversationList } from "../../hooks/useConversationList";

import './styles/index.scss';


export function UIConversationList() {
  const { activeProfile, activeConversation, setActiveConversation } = useUIKit();

  const { conversations, loadMore, loading, hasMore  } = useConversationList(activeProfile?.id);

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