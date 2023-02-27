import React, { PropsWithChildren, useContext } from 'react';
import { UIChatHeaderDefaultProps } from '../components';
import { MessageContextProps, UIMessageProps } from '../components/UIMessage';
import { EmptyStateIndicatorProps } from '../components/EmptyStateIndicator';
import { UIConversationHeaderDefaultProps } from '../components/UIConversationListHeader/UIConversationHeaderDefault';

export interface UnknowPorps {
  [propsName: string]: any
}

export interface ComponentContextValue {
  UIMessage?: React.ComponentType<UIMessageProps | UnknowPorps>,
  UIChatHeader?: React.ComponentType<UIChatHeaderDefaultProps>,
  UIConversationHeader?: React.ComponentType<UIConversationHeaderDefaultProps>,
  EmptyStateIndicator?: React.ComponentType<EmptyStateIndicatorProps>,
  UIMessageInput?: React.ComponentType<UnknowPorps>,
  MessageContext?: React.ComponentType<MessageContextProps>,
  InputPlugins?: React.ComponentType<UnknowPorps>,
  MessagePlugins?: React.ComponentType<UnknowPorps>,
  InputQuote?: React.ComponentType<UnknowPorps>,
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

export function useComponentContext(
  componentName?: string,
) {
  const contextValue = useContext(ComponentContext);

  if (!contextValue) {
    return {} as ComponentContextValue;
  }

  return contextValue as ComponentContextValue;
}