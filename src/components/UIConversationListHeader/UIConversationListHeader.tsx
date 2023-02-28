import React, { PropsWithChildren } from 'react';
import { UIConversationListHeaderDefaultProps, UIConversationListHeaderDefault } from './UIConversationListHeaderDefault';
import { useComponentContext } from '../../context';

import './styles/index.scss';

export interface UIConversationListHeaderProps {
  UIConversationListHeader?: React.ComponentType<UIConversationListHeaderDefaultProps>,
}

export function UIConversationListHeader<T extends UIConversationListHeaderProps>(
  props: PropsWithChildren<T>,
): React.ReactElement {
  const {
    UIConversationListHeader: propsUIConversationListHeader,
  } = props;

  const { UIConversationListHeader: ContextUIConversationListHeader } = useComponentContext('UIConversationListHeader');

  const UIConversationListHeaderUIComponent = propsUIConversationListHeader || ContextUIConversationListHeader || UIConversationListHeaderDefault;

  return (
    <UIConversationListHeaderUIComponent />
  );
}