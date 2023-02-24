import React, { PropsWithChildren, useContext } from 'react';
import { Message } from '../types';

export interface ChatActionContextValue {
  loadMoreMessages?: () => Promise<void>,
  loadMoreConversations?: (accountId: string) => Promise<void>,
  sendMessage?: (message: Message, options?:any) => Promise<void>,
  removeMessage?: (message: Message) => void,
  updateMessage?: (messages: Array<Message>) => void,
  createTextMessage?: (options: any/* CreateTextMessageProps*/) => Message,
  createFaceMessage?: (options: any/*CreateFaceMessageProps*/) => Message,
  createImageMessage?: (options: any/*CreateUploadMessageProps*/) => Message,
  createVideoMessage?: (options: any/*CreateUploadMessageProps*/) => Message,
  createFileMessage?: (options: any/*CreateUploadMessageProps*/) => Message,
  createForwardMessage?: (options: any/*CreateForwardMessageProps*/) => Message,
  createCustomMessage?: (options: any/*CreateCustomMessageProps*/) => Message,
  createAudioMessage?: (options: any/*CreateUploadMessageProps*/) => Message,
  createTextAtMessage?: (options: any/*CreateTextAtMessageProps*/) => Message,
  createLocationMessage?: (options: any/*CreateLocationMessageProps*/) => Message,
  createMergerMessage?: (options: any/*CreateMergerMessageProps*/) => Message,
  editLocalmessage?: (message: Message) => void,
  operateMessage?: (data?: any/*OperateMessageParams*/) => void,
  revokeMessage?: (message:Message) => Promise<Message>,
  setAudioSource?: (source: HTMLAudioElement | null) => void,
  setVideoSource?: (source: HTMLVideoElement | null) => void,
  setHighlightedMessageId?: (highlightedMessageId: string) => void,
  updataUploadPenddingMessageList?: (message?:Message) => void,

  pinConversation?: (conversationID: string, pinned: boolean) => void;
  deleteConversation?: (conversationID: string) => void;
}

export const ChatActionContext = React.createContext<ChatActionContextValue | undefined>(
  undefined,
);

export function ChatActionProvider({
  children,
  value,
}: PropsWithChildren<{
  value: ChatActionContextValue
}>):React.ReactElement {
  return (
    <ChatActionContext.Provider
      value={(value as unknown) as ChatActionContextValue}
    >
      {children}
    </ChatActionContext.Provider>
  );
}

export const useChatActionContext = (componentName?: string) => {
  const contextValue = useContext(ChatActionContext);

  if (!contextValue && componentName) {
    return {} as ChatActionContextValue;
  }

  return (contextValue as unknown) as ChatActionContextValue;
};