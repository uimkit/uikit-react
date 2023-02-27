import React, { PropsWithChildren } from 'react';
import { Icon, IconTypes } from '../Icon';
import type { MessageContextProps } from './MessageText';
import { ConversationType } from '../../types';

function MessageFileWithContext <T extends MessageContextProps>(
  props: PropsWithChildren<T>,
):React.ReactElement {
  const {
    context,
    message,
    children,
  } = props;
  return (
    <a
      href={context.url}
      download={context.name}
      target="_parent"
      className={`bubble message-file bubble-${message.flow} ${message?.conversation_type === ConversationType.Group ? 'group' : ''}`}
      rel="noreferrer"
    >
      <main className="message-file-main">
        <Icon className="icon" width={15} height={20} type={IconTypes.FILE} />
        <label htmlFor="message-file">{ context.name }</label>
      </main>
      <div className="message-file-footer">
        <span className="message-file-size">{ context.size }</span>
        {children}
      </div>
    </a>
  );
}

const MemoizedMessageFile = React.memo(MessageFileWithContext) as
typeof MessageFileWithContext;

export function MessageFile(props:MessageContextProps):React.ReactElement {
  return (
    <MemoizedMessageFile {...props} />
  );
}