import React, { PropsWithChildren, useContext } from 'react';
import { GroupMember, Message } from '../types';
import { OperateMessageParams } from '../components/UIChat/hooks/useHandleMessage';

export interface ChatActionContextValue {
  loadMoreMessages?: () => Promise<void>;
  sendMessage?: (message: Message, options?:any) => Promise<void>;
  updateMessage?: (messages: Array<Message>) => void;
  deleteMessage?: (message: Message) => void;
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
  editLocalmessage?: (message: Message) => void;
  operateMessage?: (data?: OperateMessageParams) => void;
  revokeMessage?: (message:Message) => Promise<Message>;
  setAudioSource?: (source: HTMLAudioElement | null) => void;
  setVideoSource?: (source: HTMLVideoElement | null) => void;
  setHighlightedMessageId?: (highlightedMessageId: string) => void;

  jumpToLatestMessage: () => Promise<void>;

  saveGroupMembers: (members: GroupMember[]) => void;
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