import React, { PropsWithChildren, useContext } from 'react';
import { UIChatHeaderDefaultProps } from '../components/UIChatHeader';
import { MessageContextProps, UIMessageProps } from '../components/UIMessage';
import { EmptyStateIndicatorProps } from '../components/EmptyStateIndicator';
import { UIConversationListHeaderDefaultProps } from '../components/UIConversationListHeader';
import { SuggestionListHeaderProps } from '../components/AutoCompleteTextarea';
import { SuggestionItemProps, SuggestionListProps } from '../components/UIChatAutoComplete';
import { LoadingIndicatorProps } from '../components/Loading';
import { MessageNotificationProps } from '../components/UIMessageList/MessageNotification';
import { MessageListNotificationsProps } from '../components/UIMessageList/MessageListNotifications';
import { DateSeparatorProps } from '../components/DateSeparator';

export interface UnknowPorps {
  [propsName: string]: any
}

export type ComponentContextValue = {
  UIMessage?: React.ComponentType<UIMessageProps | UnknowPorps>;
  UIChatHeader?: React.ComponentType<UIChatHeaderDefaultProps>;
  UIConversationListHeader?: React.ComponentType<UIConversationListHeaderDefaultProps>;
  AutocompleteSuggestionHeader?: React.ComponentType<SuggestionListHeaderProps>;
  AutocompleteSuggestionItem?: React.ComponentType<SuggestionItemProps>;
  AutocompleteSuggestionList?: React.ComponentType<SuggestionListProps>;
  EmptyStateIndicator?: React.ComponentType<EmptyStateIndicatorProps>;
  UIMessageInput?: React.ComponentType<UnknowPorps>;
  MessageContext?: React.ComponentType<MessageContextProps>;
  InputPlugins?: React.ComponentType<UnknowPorps>;
  MessagePlugins?: React.ComponentType<UnknowPorps>;
  InputQuote?: React.ComponentType<UnknowPorps>;
  TriggerProvider?: React.ComponentType;
  LoadingIndicator?: React.ComponentType<LoadingIndicatorProps>;
  MessageNotification?: React.ComponentType<MessageNotificationProps>;
  MessageListNotifications?: React.ComponentType<MessageListNotificationsProps>;
  DateSeparator?: React.ComponentType<DateSeparatorProps>;
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

export const useComponentContext = (
  componentName?: string,
) => {
  const contextValue = useContext(ComponentContext);

  if (!contextValue) {
    console.warn(
      `The useComponentContext hook was called outside of the ComponentContext provider. Make sure this hook is called within a child of the Channel component. The errored call is located in the ${componentName} component.`,
    );

    return {} as ComponentContextValue;
  }

  return contextValue as ComponentContextValue;
}