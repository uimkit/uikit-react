import React, { PropsWithChildren, useContext } from 'react';
import { UIChatHeaderDefaultProps } from '../components';
import { MessageContextProps, UIMessageProps } from '../components/UIMessage';
import { EmptyStateIndicatorProps } from '../components/EmptyStateIndicator';
import { UIConversationListHeaderDefaultProps } from '../components/UIConversationListHeader';
import { CustomTrigger, DefaultStreamChatGenerics } from '../types';
import { SuggestionListHeaderProps } from '../components/AutoCompleteTextarea';
import { SuggestionItemProps, SuggestionListProps } from '../components/UIChatAutoComplete';

export interface UnknowPorps {
  [propsName: string]: any
}

export type ComponentContextValue<
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics,
  V extends CustomTrigger = CustomTrigger
> = {
  UIMessage?: React.ComponentType<UIMessageProps | UnknowPorps>;
  UIChatHeader?: React.ComponentType<UIChatHeaderDefaultProps>;
  UIConversationHeader?: React.ComponentType<UIConversationListHeaderDefaultProps>;
  AutocompleteSuggestionHeader?: React.ComponentType<SuggestionListHeaderProps>;
  AutocompleteSuggestionItem?: React.ComponentType<SuggestionItemProps<StreamChatGenerics>>;
  AutocompleteSuggestionList?: React.ComponentType<SuggestionListProps<StreamChatGenerics>>;
  EmptyStateIndicator?: React.ComponentType<EmptyStateIndicatorProps>;
  UIMessageInput?: React.ComponentType<UnknowPorps>;
  MessageContext?: React.ComponentType<MessageContextProps>;
  InputPlugins?: React.ComponentType<UnknowPorps>;
  MessagePlugins?: React.ComponentType<UnknowPorps>;
  InputQuote?: React.ComponentType<UnknowPorps>;
  TriggerProvider?: React.ComponentType;
}

export const ComponentContext = React.createContext<ComponentContextValue | undefined>(undefined);

export function ComponentProvider({
  children,
  value,
}: PropsWithChildren<{
  value: ComponentContextValue;
}>) {
  return (
    <ComponentContext.Provider value={(value as unknown) as ComponentContextValue}>
      {children}
    </ComponentContext.Provider>
  );
}

export function useComponentContext<
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics,
  V extends CustomTrigger = CustomTrigger
>(
  componentName?: string,
) {
  const contextValue = useContext(ComponentContext);

  if (!contextValue) {
    return {} as ComponentContextValue;
  }

  return contextValue as ComponentContextValue;
}