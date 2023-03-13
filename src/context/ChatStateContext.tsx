import React, {
  PropsWithChildren, useContext, RefObject,
} from 'react';
import { Message } from '../types';
import { UIMessageListProps, UIMessageInputBasicProps, UIMessageProps } from '../components';
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
  UIMessageListConfig?: UIMessageListProps,
  uploadPenddingMessageList?: Array<Message>;
  suppressAutoscroll?: boolean;
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