import React from 'react';
import { useUIKit } from "../../context";
import { UIConversationListView } from "./UIConversationListView";
import { UIConversationListHeader } from "../UIConversationListHeader";
import { useConversationList } from "../../hooks/useConversationList";
import { Conversation, Profile } from '../../types';
import './styles/index.scss';


export type UIConversationListProps = {
  activeProfile?: Profile;
  activeConversation?: Conversation;
  setActiveConversation?: (conversation: Conversation) => void;
  conversations?: Conversation[];
}

export const UIConversationList: React.FC<UIConversationListProps> = (props) => {
  const {
    activeProfile: propActiveProfile,
    activeConversation: propActiveConversation,
    setActiveConversation: propSetActiveConversation,
    conversations: propConversations,
  } = props;

  const { activeConversation: contextActiveConversation, setActiveConversation: contextSetActiveConversation, activeProfile: contextActiveProfile } = useUIKit();
  const activeConversation = propActiveConversation ?? contextActiveConversation;
  const activeProfile = propActiveProfile ?? contextActiveProfile;
  const setActiveConversation = propSetActiveConversation ?? contextSetActiveConversation;

  const { conversations: contextConversations, loadMore, loading, hasMore  } = useConversationList(activeProfile?.id);
  const conversations = propConversations?? contextConversations;

  return (
    <div className="uim-conversation-list">
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