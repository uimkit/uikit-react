import React, { PropsWithChildren } from 'react';
import { UIConversationListHeaderDefaultProps, UIConversationListHeaderDefault } from './UIConversationListHeaderDefault';

import './styles/index.scss';
import { useComponentContext } from '../../context';

export interface UIConversationListHeaderProps {
  UIConversationHeader?: React.ComponentType<UIConversationListHeaderDefaultProps>,
}

export function UIConversationListHeader<T extends UIConversationListHeaderProps>(
  props: PropsWithChildren<T>,
): React.ReactElement {
  const {
    title,
    UIConversationListHeader: propsUIConversationListHeader,
  } = props;

  const { UIConversationListHeader: ContextUIConversationListHeader } = useComponentContext('UIConversationListHeader');

  const UIConversationListHeaderUIComponent = propsUIConversationListHeader || ContextUIConversationListHeader || UIConversationListHeaderDefault;

  return (
    <UIConversationListHeaderUIComponent />
  );
}