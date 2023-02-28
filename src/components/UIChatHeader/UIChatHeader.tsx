import React, { PropsWithChildren } from 'react';
import { Conversation } from '../../types';
import { UIChatHeaderDefaultProps, UIChatHeaderDefault } from './UIChatHeaderDefault';
import { useComponentContext, useUIKit } from '../../context';

import './styles/index.scss';

export interface UIChatHeaderProps {
  title?: string,
  UIChatHeader?: React.ComponentType<UIChatHeaderDefaultProps>,
  conversation?: Conversation,
  avatar?: React.ReactElement | string,
  headerOpateIcon?: React.ReactElement | string,
}

export function UIChatHeader<T extends UIChatHeaderProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    title,
    conversation: propsConversation,
    UIChatHeader: propsUIChatHeader,
    avatar,
    headerOpateIcon,
  } = props;

  const { activeConversation: contextConversation } = useUIKit('UIChatHeader');
  const { UIChatHeader: ContextUIChatHeader } = useComponentContext('UIChatHeader');

  const UIChatHeaderUIComponent = propsUIChatHeader || ContextUIChatHeader || UIChatHeaderDefault;
  const conversation = propsConversation || contextConversation;

  return (
    <UIChatHeaderUIComponent
      title={title}
      conversation={conversation}
      avatar={avatar}
      opateIcon={headerOpateIcon}
    />
  );
}