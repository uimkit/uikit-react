import React, { PropsWithChildren } from 'react';
import type { UIMessageProps } from './UIMessage';

import { MessageBubble } from './MessageBubble';
import { MessageTip } from './MessageTip';
import { messageShowType, useComponentContext, useUIMessageContext } from '../../context';
import { MessageSystem } from './MessageSystem';
import { MessageRevoke } from './MessageRevoke';
import { MessageName } from './MessageName';
import { MessageAvatar } from './MessageAvatar';
import { MessageType } from '../../types';

function UIMessageDefaultWithContext <T extends UIMessageProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    message,
    MessageContext: propsMessageContext,
    MessagePlugins: propsMessagePlugins,
    className,
  } = props;

  const {
    MessageContext: contextMessageContext,
    MessagePlugins: contextMessagePlugins,
  } = useComponentContext('UIMessage');

  const {
    prefix,
    suffix,
    customName,
    showAvatar = messageShowType.IN,
    showName = messageShowType.IN,
    customAvatar,
  } = useUIMessageContext('UIMessage');

  const MessageContextUIComponent = propsMessageContext || contextMessageContext;
  const MessagePlugins = propsMessagePlugins || contextMessagePlugins;

  return (
    <div
      className={
      `message-default
      ${(message?.type === MessageType.GroupTip || message?.revoked) ? 'tip' : message?.flow}
      ${className}
      `
      }
    >
      {
        message?.type === MessageType.GroupTip
        && (<MessageTip message={message} />)
      }
      {
        message?.type === MessageType.GroupSystemNotice
        && (<MessageSystem message={message} />)
      }
      {
        message?.revoked
        && (<MessageRevoke message={message} />)
      }
      {message?.type !== MessageType.GroupTip
      && message?.type !== MessageType.GroupSystemNotice
      && !message?.revoked
      && (
      <div
        className={`${message?.flow ?? 'in'}`}
        key={message?.id}
        data-message-id={message?.id}
      >
        {prefix}
        <MessageAvatar message={message} CustomAvatar={customAvatar} showType={showAvatar} />
        <main className="content">
          <MessageName message={message} CustomName={customName} showType={showName} />
          <MessageBubble
            message={message}
            Context={MessageContextUIComponent}
            Plugins={MessagePlugins}
          >
            <MessageContextUIComponent message={message} />
          </MessageBubble>
        </main>
        {suffix}
      </div>
      )}
    </div>
  );
}

const MemoizedUIMessageDefault = React.memo(UIMessageDefaultWithContext) as typeof UIMessageDefaultWithContext;

export function UIMessageDefault(props: UIMessageProps):React.ReactElement {
  return (
    <MemoizedUIMessageDefault
      {...props}
    />
  );
}