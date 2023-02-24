import { useChatActionContext, useUIKit } from "../../context";
import { UIConversationListView } from "./UIConversationListView";
import ConversationListHeader from "./ConversationListHeader";
import { useConversationList } from "../../hooks/useConversationList";
import './styles/index.scss';

export function UIConversationList() {
  const { activeAccount, activeConversation, setActiveConversation } = useUIKit();
  const { loadMoreConversations } = useChatActionContext();

  const { conversations } = useConversationList(activeAccount?.id);

  return (
    <div className="uim-conversation">
      <ConversationListHeader />
      <UIConversationListView 
        activeConversation={activeConversation}
        setActiveConversation={setActiveConversation}
        conversations={conversations} 
        loadMore={() => loadMoreConversations(activeAccount?.id)}
      />
    </div>
  );
}