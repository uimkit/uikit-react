import { UIMessage } from '../UIMessage';
import VirtualList from 'rc-virtual-list';
import { Message } from "../../types";
import './styles/index.scss';


export type UIMessageListViewProps = {
  messages: Message[];
  loadMore: () => void;
  hasMore: boolean;
  containerHeight: number;
}

export function UIMessageListView({ 
  messages, 
  loadMore, 
  containerHeight,
}: UIMessageListViewProps) {
  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === 400) {
      loadMore?.();
    }
  };

  return (
    <div className="uim-message-list">
      <VirtualList
        data={messages}
        height={containerHeight}
        itemKey="id"
        onScroll={onScroll}
      >
        {(message: Message) => (
          <UIMessage key={message.id} message={message} />
        )}
      </VirtualList>
    </div>
  );
}