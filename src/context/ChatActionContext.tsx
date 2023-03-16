import React, { PropsWithChildren, useContext } from 'react';
import { Message } from '../types';
import { OperateMessageParams } from '../components/UIChat/hooks/useHandleMessage';

export interface ChatActionContextValue {
  loadMoreMessages?: () => Promise<void>;
  createTextMessage?: (options: any/* CreateTextMessageProps*/) => Message;
  createFaceMessage?: (options: any/*CreateFaceMessageProps*/) => Message;
  createImageMessage?: (options: any/*CreateUploadMessageProps*/) => Message;
  createVideoMessage?: (options: any/*CreateUploadMessageProps*/) => Message;
  createFileMessage?: (options: any/*CreateUploadMessageProps*/) => Message;
  createForwardMessage?: (options: any/*CreateForwardMessageProps*/) => Message;
  createCustomMessage?: (options: any/*CreateCustomMessageProps*/) => Message;
  createAudioMessage?: (options: any/*CreateUploadMessageProps*/) => Message;
  createTextAtMessage?: (options: any/*CreateTextAtMessageProps*/) => Message;
  createLocationMessage?: (options: any/*CreateLocationMessageProps*/) => Message;
  createMergerMessage?: (options: any/*CreateMergerMessageProps*/) => Message;
  editLocalMessage?: (message: Message) => void;
  operateMessage?: (data?: OperateMessageParams) => void;
  revokeMessage?: (message: Message) => Promise<void>;
  setAudioSource?: (source: HTMLAudioElement | null) => void;
  setVideoSource?: (source: HTMLVideoElement | null) => void;
  setHighlightedMessageId?: (highlightedMessageId: string) => void;
  sendMessage?: (message: Message, options?:any) => Promise<void>;
  editMessage?: (message: Message) => Promise<Message>;
  resendMessage?: (message: Message) => void;
  deleteMessage?: (message: Message) => void;

  jumpToLatestMessage: () => Promise<void>;
  
  updateUploadPenddingMessageList?: (message?:Message) => void,
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