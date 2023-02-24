import { useUIKit } from "../../context";
import { UIMessageListView } from "./UIMessageListView";
import { useConversationMessageList } from '../../hooks';



export function UIMessageList1() {  
  const { activeConversation } = useUIKit();

  const { messages } = useConversationMessageList(activeConversation?.id);

  return (
    <>
      <UIMessageListView 
        containerHeight={800}
        messages={messages}
        hasMore={true}
        loadMore={() => {}} 
      />
    </>
  );
}