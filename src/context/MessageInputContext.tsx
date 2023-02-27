
import React, {
  PropsWithChildren,
  ChangeEventHandler,
  useContext,
  KeyboardEventHandler,
  MutableRefObject,
} from 'react';
import { TriggerSettings } from '../components/UIMessageInput/DefaultTriggerProvider';
import { CustomTrigger, DefaultStreamChatGenerics } from '../types';
import { PluginConfigProps } from '../components';
import { Emoji } from '@emoji-mart/data';// 有点污染;


export type MessageInputContextValue<
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics,
  V extends CustomTrigger = CustomTrigger
> = {
  text?: string;
  disabled?: boolean;
  // dispatch?: (params: dispatchParams) => void;
  handleChange?: ChangeEventHandler<HTMLTextAreaElement>;
  handleSubmit?: (event: React.BaseSyntheticEvent) => void;
  handleKeyDown?: KeyboardEventHandler<HTMLTextAreaElement>;
  textareaRef?: MutableRefObject<HTMLTextAreaElement | undefined>;
  onSelectEmoji?: (emoji: Emoji) => void;
  sendFaceMessage?: (emoji: any /*EmojiData*/) => void;
  sendUploadMessage?: (file: any/*filesData*/, type: any/*MESSAGE_TYPE_NAME*/) => void;
  insertText?: (textToInsert: string) => void;
  setText?: (textToInsert: string) => void;
  focus?: boolean;
  plugins?: Array<React.ReactElement>;
  showNumber?: number;
  MoreIcon?: React.ReactElement;
  handlePasete?: (e: ClipboardEvent) => void;
  pluginConfig?: PluginConfigProps;

  autocompleteTriggers?: TriggerSettings<DefaultStreamChatGenerics, V>;
}

export const MessageInputContext = React.createContext<MessageInputContextValue>(undefined);

export function MessageInputContextProvider({ children, value }:PropsWithChildren<{
  value: MessageInputContextValue
}>):React.ReactElement {
return (
  <MessageInputContext.Provider value={value}>
    {children}
  </MessageInputContext.Provider>
);
}
export function useMessageInputContext(componentName?:string): MessageInputContextValue {
  const contextValue = useContext(MessageInputContext);
  if (!contextValue && componentName) {
    return {} as MessageInputContextValue;
  }
  return (contextValue as unknown) as MessageInputContextValue;
}