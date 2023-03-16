
import React, {
  PropsWithChildren,
  useContext,
  KeyboardEventHandler,
} from 'react';
import { MessageInputHookProps, MessageInputState, TriggerSettings, UIMessageInputProps } from '../components';


export type MessageInputContextValue = 
  MessageInputState & 
  MessageInputHookProps & 
  Omit<UIMessageInputProps, 'Input'> & {
  text?: string;
  handleKeyDown?: KeyboardEventHandler<HTMLTextAreaElement>;
  sendFaceMessage?: (emoji: any /*EmojiData*/) => void;
  sendUploadMessage?: (file: any/*filesData*/, type: any/*MESSAGE_TYPE_NAME*/) => void;
  setText?: (textToInsert: string) => void;
  plugins?: Array<React.ReactElement>;
  showNumber?: number;
  MoreIcon?: React.ReactElement;

  autocompleteTriggers?: TriggerSettings;
};

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