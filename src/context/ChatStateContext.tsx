import React, {
  PropsWithChildren, useContext, RefObject,
} from 'react';
import { GroupMember, Message, Conversation, ChatConfigWithInfo } from '../types';
import { UIMessageListProps, UIMessageInputBasicProps, UIMessageProps } from '../components';
import { OperateMessageParams } from '../components/UIChat/hooks/useHandleMessage';


export type ChatState = {
  messages: Message[];
  hasMore: boolean;
  loadingMore: boolean;
  hasMoreNewer: boolean;
  loadingMoreNewer: boolean;
  /** 禁止自动滚动 */
  suppressAutoscroll?: boolean;
  /** 高亮消息的 ID */
  highlightedMessageId?: string;

  /** 群成员列表, 会话是群类型时会用到 */
  members?: GroupMember[];
};

export type ChatStateContextValue = ChatState & {
  conversation?: Conversation;
  
  chatConfig?: ChatConfigWithInfo | undefined;

  init?: boolean;
  // TODO 这个是tim的，可能要对标 streamchat 重构掉
  lastMessageID?:string;
  // TODO 这个是tim的，可能要对标 streamchat 重构掉
  isSameLastMessageID?: boolean;
  messageListRef?: RefObject<HTMLDivElement>;
  // TODO 这个是tim的，可能要对标 streamchat 重构掉
  operateData?: OperateMessageParams;
  // TODO 这个是tim的，可能要对标 streamchat 重构掉
  messageConfig?: UIMessageProps;
  // TODO 这个是tim的，可能要对标 streamchat 重构掉
  cloudCustomData?: string;
  // TODO 这个是tim的，可能要对标 streamchat 重构掉
  UIMessageInputConfig?: UIMessageInputBasicProps,
  // TODO 这个是tim的，可能要对标 streamchat 重构掉
  audioSource?: HTMLAudioElement;
  // TODO 这个是tim的，可能要对标 streamchat 重构掉
  vidoeSource?: HTMLVideoElement;
  // TODO 这个是tim的，可能要对标 streamchat 重构掉
  UIMessageListConfig?: UIMessageListProps;
  // TODO 这个是tim的，可能要对标 streamchat 重构掉
  uploadPenddingMessageList?: Array<Message>;
}

export const ChatStateContext = React.createContext<ChatStateContextValue>(null);
export function ChatStateContextProvider({ children, value }:PropsWithChildren<{
    value: ChatStateContextValue
}>): React.ReactElement {
  return (
    <ChatStateContext.Provider value={value}>
      {children}
    </ChatStateContext.Provider>
  );
}

export function useChatStateContext(componentName?: string): ChatStateContextValue {
  const contextValue = useContext(ChatStateContext);
  if (!contextValue && componentName) {
    return {} as ChatStateContextValue;
  }
  return (contextValue as unknown) as ChatStateContextValue;
}