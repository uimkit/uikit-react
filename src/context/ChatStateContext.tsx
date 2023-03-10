import React, {
  PropsWithChildren, useContext, RefObject,
} from 'react';
import { Message } from '../types';
import { ChatConfig, MessageListProps, UIMessageInputBasicProps, UIMessageProps } from '../components';
import { OperateMessageParams } from '../components/UIChat/hooks/useHandleMessage';

export interface ChatStateContextValue {
  init?: boolean,
  highlightedMessageId?: string,
  lastMessageID?:string,
  isSameLastMessageID?: boolean,
  messageListRef?: RefObject<HTMLDivElement>,
  // textareaRef?: MutableRefObject<HTMLTextAreaElement | undefined>,
  operateData?: OperateMessageParams,
  messageConfig?: UIMessageProps,
  cloudCustomData?: string,
  UIMessageInputConfig?: UIMessageInputBasicProps,
  audioSource?: HTMLAudioElement,
  vidoeSource?: HTMLVideoElement,
  UIMessageListConfig?: MessageListProps,
  uploadPenddingMessageList?: Array<Message>;
  chatConfig?: ChatConfig | undefined;
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