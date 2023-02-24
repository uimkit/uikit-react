import React, {
  PropsWithChildren,
  ChangeEventHandler,
  useContext,
  KeyboardEventHandler,
  MutableRefObject,
} from 'react';
import { PluginConfigProps } from '../components';
import type { ICursorPos, EmojiData, filesData } from '../components/UIMessageInput/hooks';

interface dispatchParams {
  type: string,
  value?: string,
}
export interface UIMessageInputContextValue {
  text?: string,
  disabled?: boolean,
  dispatch?: (params: dispatchParams) => void,
  handleChange?: ChangeEventHandler<HTMLTextAreaElement>,
  handleSubmit?: (event: React.BaseSyntheticEvent) => void,
  handleKeyDown?: KeyboardEventHandler<HTMLTextAreaElement>,
  textareaRef?: MutableRefObject<HTMLTextAreaElement | undefined>,
  onSelectEmoji?: (emoji: EmojiData) => void,
  sendFaceMessage?: (emoji: EmojiData) => void,
  sendUploadMessage?: (file: filesData, type: MESSAGE_TYPE_NAME) => void,
  insertText?: (textToInsert: string) => void,
  setText?: (textToInsert: string) => void,
  focus?: boolean,
  handlePasete?: (e:ClipboardEvent) => void,
  setCursorPos?: (e:ICursorPos) => void,
  pluginConfig?: PluginConfigProps,
}

export const UIMessageInputContext = React.createContext<UIMessageInputContextValue>(undefined);
export function UIMessageInputContextProvider({ children, value }:PropsWithChildren<{
    value: UIMessageInputContextValue
}>):React.ReactElement {
  return (
    <UIMessageInputContext.Provider value={value}>
      {children}
    </UIMessageInputContext.Provider>
  );
}

export function useUIMessageInputContext(componentName?:string): UIMessageInputContextValue {
  const contextValue = useContext(UIMessageInputContext);
  if (!contextValue && componentName) {
    return {} as UIMessageInputContextValue;
  }
  return (contextValue as unknown) as UIMessageInputContextValue;
}