
import React, {
  PropsWithChildren,
  ChangeEventHandler,
  useContext,
  KeyboardEventHandler,
  MutableRefObject,
} from 'react';


interface dispatchParams {
  type: string,
  value?: string,
}
export interface MessageInputContextValue {
  text?: string,
  disabled?: boolean,
  dispatch?: (params: dispatchParams) => void,
  handleChange?: ChangeEventHandler<HTMLTextAreaElement>,
  handleSubmit?: (event: React.BaseSyntheticEvent) => void,
  handleKeyDown?: KeyboardEventHandler<HTMLTextAreaElement>,
  textareaRef?: MutableRefObject<HTMLTextAreaElement | undefined>,
  onSelectEmoji?: (emoji: any/*EmojiData*/) => void,
  sendFaceMessage?: (emoji: any /*EmojiData*/) => void,
  sendUploadMessage?: (file: any/*filesData*/, type: any/*MESSAGE_TYPE_NAME*/) => void,
  insertText?: (textToInsert: string) => void,
  setText?: (textToInsert: string) => void,
  focus?: boolean,
  plugins?: Array<React.ReactElement>,
  showNumber?: number,
  MoreIcon?: React.ReactElement,
  handlePasete?: (e: ClipboardEvent) => void,
  setCursorPos?: (e: any/*ICursorPos*/) => void,
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